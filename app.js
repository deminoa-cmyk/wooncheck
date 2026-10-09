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

  // Een bedrag met een duidelijke VOORBEELD-markering erbij.
  function voorbeeld(waarde) {
    var span = maak("span", "voorbeeld");
    span.appendChild(maak("span", "voorbeeld-waarde", waarde));
    span.appendChild(maak("span", "voorbeeld-label", G.voorbeeldWoord));
    return span;
  }

  /* ---------- Vaste teksten invullen ---------- */
  document.querySelectorAll("[data-tekst]").forEach(function (el) {
    el.textContent = tekst(el.getAttribute("data-tekst"));
  });
  document.querySelectorAll(".terug").forEach(function (el) {
    el.textContent = "← " + G.terugKnop;
  });

  /* ---------- Scherm 1 ---------- */
  var adresVeld = document.getElementById("adres");
  var labelVeld = document.getElementById("label");
  var melding = document.getElementById("label-melding");

  adresVeld.placeholder = G.start.adresVoorbeeld;

  labelVeld.appendChild(new Option(G.start.labelKiesTekst, ""));
  G.labels.forEach(function (l, i) {
    labelVeld.appendChild(new Option(l.naam, String(i)));
  });

  // De link werkt pas als in gegevens.js een echt webadres staat.
  var link = document.getElementById("opzoeken-link");
  if (/^https?:\/\//.test(G.start.opzoekenLink)) {
    link.href = G.start.opzoekenLink;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.href = "#";
    link.addEventListener("click", function (e) { e.preventDefault(); });
    document.getElementById("opzoeken-markering").textContent = G.start.opzoekenLink;
  }

  function verbergMelding() {
    melding.textContent = "";
    labelVeld.removeAttribute("aria-invalid");
  }
  labelVeld.addEventListener("change", verbergMelding);

  document.getElementById("startformulier").addEventListener("submit", function (e) {
    e.preventDefault();
    if (labelVeld.value === "") {
      melding.textContent = G.start.meldingGeenLabel;
      labelVeld.setAttribute("aria-invalid", "true");
      labelVeld.focus();
      return;
    }
    verbergMelding();
    gekozen.adres = adresVeld.value.trim();
    gekozen.labelIndex = Number(labelVeld.value);
    vulUitkomst();
    gaNaar("uitkomst");
  });

  /* ---------- Scherm 2 ---------- */
  function vulUitkomst() {
    var l = G.labels[gekozen.labelIndex];
    document.getElementById("toon-adres").textContent = gekozen.adres || G.uitkomst.geenAdres;
    document.getElementById("toon-label").textContent = l.kort;
    document.getElementById("bedrag-aankoop").textContent = euro(l.aankoop);
    document.getElementById("bedrag-verduurzaming").textContent = euro(l.verduurzaming);
  }

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
    var blok = maak("div", "blok");
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
