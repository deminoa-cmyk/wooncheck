/*
  WERKING VAN WOONCHECK
  Alle teksten en bedragen komen uit gegevens.js.
  Er wordt niets opgeslagen of verstuurd.
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

  var punten = document.getElementById("punten");
  G.start.punten.forEach(function (p) { punten.appendChild(maak("li", "", p)); });

  // Keuzeknoppen voor het label, in drie rijen: A t/m G, de labels
  // boven A, en de brede knoppen.
  var rijen = [maak("div", "labelrij"), maak("div", "labelrij"), maak("div", "labelrij labelrij-breed")];
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
  rijen.forEach(function (r) { if (r.firstChild) knoppenVak.appendChild(r); });

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
    var postcode = postcodeVeld.value.trim().toUpperCase().replace(/^(\d{4})\s*([A-Z]{2})$/, "$1 $2");
    var huisnummer = huisnummerVeld.value.trim();
    gekozen.adres = [postcode, huisnummer].filter(Boolean).join(" ");
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
