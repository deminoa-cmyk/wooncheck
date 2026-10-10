/*
  WERKING VAN LABELRUIMTE
  Alle teksten en bedragen komen uit gegevens.js.
  Er wordt niets opgeslagen. Alleen postcode en huisnummer gaan naar
  PDOK (de kaartendienst van de overheid) om het adres te controleren.
*/
(function () {
  "use strict";

  var G = window.GEGEVENS;
  var gekozen = { adres: "", labelIndex: -1 };

  // Haalt een tekst op met een pad zoals "start.titel".
  function tekst(pad) {
    return pad.split(".").reduce(function (deel, sleutel) {
      return deel ? deel[sleutel] : undefined;
    }, G);
  }

  // 20000 wordt "€ 20.000".
  function euro(getal) {
    return "€ " + String(getal).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function maak(soort, klasse, inhoud) {
    var el = document.createElement(soort);
    if (klasse) el.className = klasse;
    if (inhoud !== undefined) el.textContent = inhoud;
    return el;
  }

  // Een link die in een nieuw tabblad opent, met een verborgen
  // melding daarover voor schermlezers.
  function nieuwTabbladLink(a, adres) {
    a.href = adres;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.appendChild(maak("span", "onzichtbaar", " " + G.nieuwTabblad));
    return a;
  }

  // Een bedrag met een duidelijke VOORBEELD-markering erbij.
  function voorbeeld(waarde) {
    var span = maak("span", "voorbeeld");
    span.appendChild(maak("span", "voorbeeld-waarde", waarde));
    span.appendChild(maak("span", "voorbeeld-label", G.voorbeeldWoord));
    return span;
  }

  /* ---------- Vaste teksten invullen ---------- */
  document.querySelectorAll("[data-tekst]").forEach(function (el) {
    el.textContent = tekst(el.getAttribute("data-tekst")) || "";
  });
  document.querySelectorAll(".terug").forEach(function (el) {
    el.textContent = "← " + G.terugKnop;
  });

  /* ---------- Scherm 1 ---------- */
  var postcodeVeld = document.getElementById("postcode");
  var huisnummerVeld = document.getElementById("huisnummer");
  var melding = document.getElementById("label-melding");
  var knoppenVak = document.getElementById("labelknoppen");

  postcodeVeld.placeholder = G.start.postcodeVoorbeeld;
  huisnummerVeld.placeholder = G.start.huisnummerVoorbeeld;

  /* ---------- Adres controleren via PDOK ----------
     PDOK is de gratis kaartendienst van de overheid. Alleen postcode en
     huisnummer gaan daarheen; we bewaren niets. */
  var PDOK = "https://api.pdok.nl/bzk/locatieserver/search/v3_1/free";
  var straatVeld = document.getElementById("straat");
  var woonplaatsVeld = document.getElementById("woonplaats");
  var adresStatus = document.getElementById("adres-status");
  var adresKeuzes = document.getElementById("adres-keuzes");
  var gevonden = null;    // het gecontroleerde adres
  var wachten = null;     // timer, zodat we niet bij elke toets zoeken
  var lopend = null;      // de zoekvraag die nu loopt

  function klein(t) { return String(t || "").toLowerCase().replace(/[\s-]/g, ""); }

  function postcodeNetjes(p) { return p.replace(/^(\d{4})\s*([A-Z]{2})$/, "$1 $2"); }

  function nummerTekst(d) {
    return d.huisnummer + (d.huisletter || "") + (d.huisnummertoevoeging ? "-" + d.huisnummertoevoeging : "");
  }

  function adresTekst(d) {
    return d.straatnaam + " " + nummerTekst(d) + ", " + postcodeNetjes(d.postcode) + " " + d.woonplaatsnaam;
  }

  function wisAdres() {
    gevonden = null;
    straatVeld.value = "";
    woonplaatsVeld.value = "";
    adresStatus.textContent = "";
    adresKeuzes.textContent = "";
    adresKeuzes.hidden = true;
    wisLabelZoeken();
  }

  function kiesAdres(d) {
    gevonden = { tekst: adresTekst(d), id: d.adresseerbaarobject_id };
    straatVeld.value = d.straatnaam;
    woonplaatsVeld.value = d.woonplaatsnaam;
    huisnummerVeld.value = nummerTekst(d);
    postcodeVeld.value = postcodeNetjes(d.postcode);
    adresKeuzes.textContent = "";
    adresKeuzes.hidden = true;
    adresStatus.textContent = G.start.adresGevonden + " " + gevonden.tekst;
    zoekLabel(gevonden.id);
  }

  /* ---------- Energielabel opzoeken via het tussenstation ----------
     Het tussenstation (Cloudflare) vraagt het label op bij EP-Online met
     een geheime sleutel. Alleen het adresnummer uit de BAG gaat erheen. */
  var labelStatus = document.getElementById("label-status");
  var labelGevonden = document.getElementById("label-gevonden");
  var labelBadge = document.getElementById("label-badge");
  var labelGeldig = document.getElementById("label-geldig");
  var labelAnders = document.getElementById("label-anders");
  var labelKeuzes = document.getElementById("label-keuzes");
  var labelLopend = null;
  var labelAutomatisch = -1;   // het label dat we zelf hebben gekozen

  // "Op basis van EP-Online (…) is het energielabel voor deze woning:"
  var labelBron = document.getElementById("label-bron");
  labelBron.appendChild(document.createTextNode(G.start.labelBronVoor));
  labelBron.appendChild(nieuwTabbladLink(maak("a", "", G.start.labelBronNaam), G.start.labelBronLink));
  labelBron.appendChild(document.createTextNode(G.start.labelBronNa));

  function toonLabelKeuzes(open) {
    labelKeuzes.hidden = !open;
    labelAnders.setAttribute("aria-expanded", String(open));
  }

  labelAnders.addEventListener("click", function () {
    var open = labelKeuzes.hidden;
    toonLabelKeuzes(open);
    if (open) {
      var aan = labelKeuzes.querySelector('input[name="label"]:checked') || labelKeuzes.querySelector("input");
      aan.focus();
    }
  });

  function wisLabelZoeken() {
    if (labelLopend) labelLopend.abort();
    labelLopend = null;
    labelStatus.textContent = "";
    labelGevonden.hidden = true;
    toonLabelKeuzes(true);
    labelAnders.setAttribute("aria-expanded", "false");
    // Een label dat bij een vorig adres hoorde, halen we weer weg.
    if (labelAutomatisch >= 0) {
      var oud = document.getElementById("label-" + labelAutomatisch);
      if (oud && oud.checked) oud.checked = false;
      labelAutomatisch = -1;
    }
  }

  function kiesLabelKnop(index) {
    var knop = document.getElementById("label-" + index);
    if (knop) knop.checked = true;
    verbergMelding();
  }

  function vul(t, label, datum) {
    return t.replace("{label}", label || "").replace("{datum}", datum || "");
  }

  function datumNetjes(d) {
    return d.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
  }

  // Toont het gevonden label in een eigen blok en verbergt de andere keuzes.
  function toonGevonden(index, badge, regel) {
    kiesLabelKnop(index);
    labelAutomatisch = index;
    labelBadge.textContent = badge;
    labelBadge.classList.toggle("label-badge-lang", badge.length > 5);
    labelGeldig.textContent = regel;
    labelStatus.textContent = "";
    labelGevonden.hidden = false;
    toonLabelKeuzes(false);
  }

  function zoekLabel(id) {
    wisLabelZoeken();
    if (!G.start.labelDienst || !/^\d{16}$/.test(String(id || ""))) return;
    var deze = new AbortController();
    labelLopend = deze;
    var stop = setTimeout(function () { deze.abort(); }, 10000);
    labelStatus.textContent = G.start.labelZoeken;

    fetch(G.start.labelDienst + "?id=" + encodeURIComponent(id), { signal: deze.signal, referrerPolicy: "no-referrer", credentials: "omit" })
      .then(function (antwoord) {
        if (!antwoord.ok) throw new Error("tussenstation " + antwoord.status);
        return antwoord.json();
      })
      .then(function (data) {
        clearTimeout(stop);
        if (deze !== labelLopend) return;
        if (!data.label) {
          labelStatus.textContent = G.start.labelNietGevonden;
          return;
        }
        var klasse = data.label.energieklasse;
        var geldigTot = data.label.geldigTot ? new Date(data.label.geldigTot) : null;
        var geldig = geldigTot && !isNaN(geldigTot);
        if (geldig && geldigTot < new Date()) {
          var geen = G.labels.findIndex(function (l) { return l.aankoop === null; });
          toonGevonden(geen, G.labels[geen].naam, vul(G.start.labelVerlopen, klasse, datumNetjes(geldigTot)));
          return;
        }
        var index = G.labels.findIndex(function (l) { return !l.breed && l.kort === klasse; });
        if (index < 0) throw new Error("onbekend label " + klasse);
        toonGevonden(index, klasse, geldig ? vul(G.start.labelGeldigTot, klasse, datumNetjes(geldigTot)) : "");
      })
      .catch(function () {
        clearTimeout(stop);
        if (deze !== labelLopend) return;
        labelStatus.textContent = G.start.labelFout;
      });
  }

  function toonKeuzes(lijst) {
    adresStatus.textContent = G.start.adresKiezen;
    adresKeuzes.textContent = "";
    lijst.forEach(function (d) {
      var knop = maak("button", "adres-keuze", adresTekst(d));
      knop.type = "button";
      knop.addEventListener("click", function () {
        kiesAdres(d);
        huisnummerVeld.focus();
      });
      adresKeuzes.appendChild(knop);
    });
    adresKeuzes.hidden = false;
  }

  function zoekAdres() {
    var postcode = postcodeVeld.value.replace(/\s/g, "").toUpperCase();
    var delen = huisnummerVeld.value.trim().match(/^(\d+)\s*-?\s*(.*)$/);
    if (!/^\d{4}[A-Z]{2}$/.test(postcode) || !delen) return;
    var nummer = delen[1];
    var toevoeging = klein(delen[2]);

    if (lopend) lopend.abort();
    var deze = new AbortController();
    lopend = deze;
    var stop = setTimeout(function () { deze.abort(); }, 8000);
    adresStatus.textContent = G.start.adresZoeken;

    var vraag = PDOK + "?q=" + encodeURIComponent("postcode:" + postcode + " AND huisnummer:" + nummer) +
      "&fq=type:adres&rows=50&fl=straatnaam,huisnummer,huisletter,huisnummertoevoeging,postcode,woonplaatsnaam,adresseerbaarobject_id";

    fetch(vraag, { signal: deze.signal, referrerPolicy: "no-referrer", credentials: "omit" })
      .then(function (antwoord) {
        if (!antwoord.ok) throw new Error("PDOK " + antwoord.status);
        return antwoord.json();
      })
      .then(function (data) {
        clearTimeout(stop);
        var lijst = (data.response && data.response.docs) || [];
        lijst.sort(function (a, b) { return nummerTekst(a).localeCompare(nummerTekst(b), "nl", { numeric: true }); });
        if (toevoeging) {
          lijst = lijst.filter(function (d) {
            return klein((d.huisletter || "") + (d.huisnummertoevoeging || "")) === toevoeging;
          });
        }
        if (lijst.length === 1) kiesAdres(lijst[0]);
        else if (lijst.length > 1) toonKeuzes(lijst);
        else adresStatus.textContent = G.start.adresNietGevonden;
      })
      .catch(function (fout) {
        clearTimeout(stop);
        // Afgebroken omdat er al een nieuwe vraag loopt: niets melden.
        if (deze !== lopend) return;
        adresStatus.textContent = G.start.adresFout;
      });
  }

  [postcodeVeld, huisnummerVeld].forEach(function (veld) {
    veld.addEventListener("input", function () {
      wisAdres();
      clearTimeout(wachten);
      wachten = setTimeout(zoekAdres, 400);
    });
  });

  var punten = document.getElementById("punten");
  G.start.punten.forEach(function (p) { punten.appendChild(maak("li", "", p)); });

  // Keuzeknoppen voor het label, in drie groepen met een kopje:
  // A t/m G, de labels boven A, en overige keuzes.
  var rijen = [maak("div", "labelrij"), maak("div", "labelrij labelrij-boven"), maak("div", "labelrij labelrij-breed")];
  G.labels.forEach(function (l, i) {
    var keuze = maak("div", "labelkeuze");
    var invoer = document.createElement("input");
    invoer.type = "radio";
    invoer.name = "label";
    invoer.id = "label-" + i;
    invoer.value = String(i);
    var lab = maak("label", "", l.naam);
    lab.htmlFor = invoer.id;
    keuze.appendChild(invoer);
    keuze.appendChild(lab);
    rijen[l.breed ? 2 : (l.rij === 2 ? 1 : 0)].appendChild(keuze);
  });
  rijen.forEach(function (r, i) {
    if (!r.firstChild) return;
    var groep = maak("div", "labelgroep");
    var kop = maak("p", "labelgroep-kop", G.start.labelGroepen[i] || "");
    kop.id = "labelgroep-" + i;
    groep.setAttribute("role", "group");
    groep.setAttribute("aria-labelledby", kop.id);
    groep.appendChild(kop);
    groep.appendChild(r);
    knoppenVak.appendChild(groep);
  });

  function gekozenLabel() {
    var aan = document.querySelector('input[name="label"]:checked');
    return aan ? Number(aan.value) : -1;
  }

  // De link werkt pas als in gegevens.js een echt webadres staat.
  var link = document.getElementById("opzoeken-link");
  if (/^https?:\/\//.test(G.start.opzoekenLink)) {
    nieuwTabbladLink(link, G.start.opzoekenLink);
  } else {
    link.href = "#";
    link.addEventListener("click", function (e) { e.preventDefault(); });
    document.getElementById("opzoeken-markering").textContent = G.start.opzoekenLink;
  }

  function verbergMelding() {
    melding.textContent = "";
  }
  knoppenVak.addEventListener("change", verbergMelding);

  document.getElementById("startformulier").addEventListener("submit", function (e) {
    e.preventDefault();
    var index = gekozenLabel();
    if (index < 0) {
      melding.textContent = G.start.meldingGeenLabel;
      knoppenVak.querySelector("input").focus();
      return;
    }
    if (G.labels[index].weetNiet) {
      melding.textContent = G.start.meldingWeetNiet;
      return;
    }
    verbergMelding();
    var postcode = postcodeNetjes(postcodeVeld.value.trim().toUpperCase());
    var huisnummer = huisnummerVeld.value.trim();
    gekozen.adres = gevonden ? gevonden.tekst : [postcode, huisnummer].filter(Boolean).join(" ");
    gekozen.labelIndex = index;
    vulUitkomst();
    gaNaar("uitkomst");
  });

  /* ---------- Scherm 2 ---------- */
  var deelStatus = document.getElementById("deel-status");
  var deelTekst = document.getElementById("deel-tekst");

  function vulUitkomst() {
    var l = G.labels[gekozen.labelIndex];
    var aankoop = document.getElementById("bedrag-aankoop");
    document.getElementById("toon-adres").textContent = gekozen.adres || G.uitkomst.geenAdres;
    document.getElementById("toon-label").textContent = l.kort;
    if (l.aankoop === null) {
      aankoop.textContent = G.uitkomst.aankoopGeenLabel;
      aankoop.classList.add("bedrag-zin");
    } else {
      aankoop.textContent = euro(l.aankoop);
      aankoop.classList.remove("bedrag-zin");
    }
    document.getElementById("bedrag-verduurzaming").textContent = euro(l.verduurzaming);
    deelStatus.textContent = "";
    deelTekst.hidden = true;
  }

  var verduurzamingPunten = document.getElementById("verduurzaming-punten");
  G.uitkomst.verduurzamingPunten.forEach(function (p) {
    verduurzamingPunten.appendChild(maak("li", "", p));
  });

  var groepen = document.getElementById("uitgeven-groepen");
  G.uitkomst.uitgevenGroepen.forEach(function (groep) {
    var div = maak("div", "groep groep-" + groep.soort);
    div.appendChild(maak("h3", "", groep.kop));
    var ul = maak("ul");
    groep.items.forEach(function (item) { ul.appendChild(maak("li", "", item)); });
    div.appendChild(ul);
    groepen.appendChild(div);
  });

  var vragen = document.getElementById("vragen");
  G.uitkomst.vragen.forEach(function (v) { vragen.appendChild(maak("li", "", v)); });

  document.getElementById("energie-waarde").appendChild(voorbeeld(G.uitkomst.energieWaarde));

  // Bij het eerste gebruik van een moeilijk woord komt een knopje
  // "Wat is dit?" dat een uitleg van één zin uitklapt.
  var vakken = document.querySelectorAll("#scherm-uitkomst .met-begrippen");
  G.uitkomst.begrippen.forEach(function (b, i) {
    var woord = b.woord.toLowerCase();
    for (var v = 0; v < vakken.length; v++) {
      var lopen = document.createTreeWalker(vakken[v], NodeFilter.SHOW_TEXT);
      var node;
      while ((node = lopen.nextNode())) {
        if (node.parentNode.closest(".wat-knop, .begrip-uitleg")) continue;
        var plek = node.nodeValue.toLowerCase().indexOf(woord);
        if (plek < 0) continue;
        var rest = node.splitText(plek + woord.length);
        var knop = maak("button", "wat-knop", G.uitkomst.watIsDitKnop);
        knop.type = "button";
        knop.appendChild(maak("span", "onzichtbaar", " (" + b.woord + ")"));
        knop.setAttribute("aria-expanded", "false");
        knop.setAttribute("aria-controls", "begrip-" + i);
        var uitleg = maak("span", "begrip-uitleg", b.uitleg);
        uitleg.id = "begrip-" + i;
        uitleg.hidden = true;
        knop.addEventListener("click", function () {
          var open = this.getAttribute("aria-expanded") === "true";
          this.setAttribute("aria-expanded", String(!open));
          document.getElementById(this.getAttribute("aria-controls")).hidden = open;
        });
        rest.parentNode.insertBefore(document.createTextNode(" "), rest);
        rest.parentNode.insertBefore(knop, rest);
        node.parentNode.closest("li, p").appendChild(uitleg);
        return;
      }
    }
  });

  // De bronregel met twee links.
  var bron = document.getElementById("bron");
  bron.appendChild(document.createTextNode(G.uitkomst.bron.voor));
  G.uitkomst.bron.links.forEach(function (b, i) {
    if (i > 0) bron.appendChild(document.createTextNode(G.uitkomst.bron.tussen));
    bron.appendChild(nieuwTabbladLink(maak("a", "", b.tekst), b.link));
  });
  bron.appendChild(document.createTextNode(G.uitkomst.bron.na));

  // Bewaren of delen: op een telefoon het deelmenu, anders kopiëren.
  // Het adres gaat niet mee. Er wordt niets naar een server gestuurd.
  function samenvatting() {
    var l = G.labels[gekozen.labelIndex];
    var u = G.uitkomst;
    return [
      G.appNaam,
      u.labelKop + ": " + l.kort,
      u.aankoopKop + ": " + (l.aankoop === null ? u.aankoopGeenLabel : euro(l.aankoop)),
      u.verduurzamingKop + ": " + euro(l.verduurzaming),
      G.disclaimer,
      location.origin + location.pathname
    ].join("\n");
  }

  function toonHandmatig(t) {
    deelStatus.textContent = G.uitkomst.deelMislukt;
    deelTekst.value = t;
    deelTekst.hidden = false;
    deelTekst.focus();
    deelTekst.select();
  }

  deelTekst.setAttribute("aria-label", G.uitkomst.deelKnop);

  document.getElementById("deel-knop").addEventListener("click", function () {
    var t = samenvatting();
    deelStatus.textContent = "";
    deelTekst.hidden = true;
    var telefoon = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (telefoon && navigator.share) {
      navigator.share({ title: G.appNaam, text: t }).catch(function (fout) {
        if (fout && fout.name !== "AbortError") toonHandmatig(t);
      });
    } else if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(t).then(function () {
        deelStatus.textContent = G.uitkomst.deelGekopieerd;
      }, function () { toonHandmatig(t); });
    } else {
      toonHandmatig(t);
    }
  });

  /* ---------- Scherm 3 ---------- */
  var woning = document.getElementById("rapport-woning");
  woning.parentNode.replaceChild(voorbeeld(G.rapport.woning), woning);

  var onderdelen = [
    ["maatregelenKop", "maatregelen", "besparing"],
    ["kostenKop", "kosten", "bedrag"],
    ["leenruimteKop", "leenruimte", "bedrag"],
    ["subsidiesKop", "subsidies", "bedrag"],
    ["woonlastenKop", "woonlasten", "bedrag"]
  ];
  var rapport = document.getElementById("rapport-onderdelen");
  onderdelen.forEach(function (o) {
    var blok = maak("div", "kaart");
    blok.appendChild(maak("h2", "", G.rapport[o[0]]));
    var lijst = maak("ul", "rijen");
    G.rapport[o[1]].forEach(function (rij) {
      var li = maak("li", "rij");
      li.appendChild(maak("span", "rij-naam", rij.naam));
      li.appendChild(voorbeeld(rij[o[2]]));
      lijst.appendChild(li);
    });
    blok.appendChild(lijst);
    rapport.appendChild(blok);
  });

  document.getElementById("koop-knop").addEventListener("click", function () {
    document.getElementById("bedankt").textContent = G.rapport.bedankt;
  });

  /* ---------- Wisselen tussen schermen ---------- */
  // Het scherm staat achter het # in de adresbalk, zodat ook de
  // terugknop van de browser of telefoon werkt.
  function gaNaar(naam) {
    if (location.hash === "#" + naam) toonScherm(naam);
    else location.hash = naam;
  }

  function toonScherm(naam) {
    if (["start", "uitkomst", "rapport"].indexOf(naam) < 0) naam = "start";
    if (naam !== "start" && gekozen.labelIndex < 0) naam = "start";
    document.querySelectorAll(".scherm").forEach(function (s) {
      s.hidden = s.id !== "scherm-" + naam;
    });
    if (naam !== "rapport") document.getElementById("bedankt").textContent = "";
    window.scrollTo(0, 0);
    document.getElementById(naam + "-titel").focus();
  }

  document.querySelectorAll("[data-naar]").forEach(function (knop) {
    knop.addEventListener("click", function () { gaNaar(knop.getAttribute("data-naar")); });
  });

  window.addEventListener("hashchange", function () {
    toonScherm(location.hash.slice(1) || "start");
  });

  // Bij het openen altijd op het startscherm beginnen.
  if (location.hash && location.hash !== "#start") {
    history.replaceState(null, "", location.pathname + location.search);
  }
})();
