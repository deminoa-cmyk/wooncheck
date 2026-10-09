/*
  GEGEVENS VOOR WOONCHECK
  =======================
  In dit bestand staan alle bedragen, lijsten en vaste teksten van de app.
  Wil je iets aanpassen? Verander alleen de tekst tussen de aanhalingstekens
  of het getal. Laat komma's, haakjes en aanhalingstekens staan.

  Bron leennormen: Tijdelijke regeling hypothecair krediet
  (wetten.overheid.nl) en Volkshuisvesting Nederland.
  Leennormen 2026. Gecontroleerd op 9 oktober 2026.

  Bedragen staan in hele euro's, zonder punt (dus 20000, niet 20.000).
*/

window.GEGEVENS = {

  /* ---------- Algemeen ---------- */
  appNaam: "Wooncheck",

  disclaimer: "Dit is een schatting en geen financieel advies. Vraag een hypotheekadviseur naar je maximale hypotheek.",

  terugKnop: "Terug",

  /* ---------- Scherm 1: Start ---------- */
  start: {
    titel: "Wat betekent het energielabel voor je hypotheek?",
    intro: "[INTRO, PAS IK ZELF AAN] Het energielabel van een huis bepaalt mee hoeveel een geldverstrekker je mag lenen. Vul het adres en het label in en zie wat dat betekent, en wat je je hypotheekadviseur kunt vragen.",
    adresLabel: "Adres van de woning",
    adresVoorbeeld: "Bijvoorbeeld Dorpsstraat 1, Utrecht",
    adresUitleg: "We bewaren je adres niet.",
    labelVraag: "Energielabel van de woning",
    labelKiesTekst: "Kies een label",
    opzoekenTekst: "Weet je het label niet? Zoek het op",
    // Vul hier het webadres in, bijvoorbeeld "https://...". Zolang hier
    // [LINK ENERGIELABEL OPZOEKEN] staat, werkt de link nog niet.
    opzoekenLink: "[LINK ENERGIELABEL OPZOEKEN]",
    knop: "Bekijk mijn check",
    meldingGeenLabel: "Kies eerst een energielabel."
  },

  /* ---------- Leennormen 2026 (in euro's) ----------
     Volgorde = volgorde in de keuzelijst.
     naam          = tekst in de keuzelijst
     kort          = tekst op scherm 2
     aankoop       = extra voor aankoop
     verduurzaming = extra voor verduurzaming
  */
  labels: [
    { naam: "A++++ met energieprestatiegarantie van minimaal tien jaar", kort: "A++++ met garantie", aankoop: 40000, verduurzaming: 0 },
    { naam: "A++++", kort: "A++++", aankoop: 30000, verduurzaming: 0 },
    { naam: "A+++",  kort: "A+++",  aankoop: 25000, verduurzaming: 0 },
    { naam: "A++",   kort: "A++",   aankoop: 20000, verduurzaming: 10000 },
    { naam: "A+",    kort: "A+",    aankoop: 20000, verduurzaming: 10000 },
    { naam: "A",     kort: "A",     aankoop: 10000, verduurzaming: 10000 },
    { naam: "B",     kort: "B",     aankoop: 10000, verduurzaming: 10000 },
    { naam: "C",     kort: "C",     aankoop: 5000,  verduurzaming: 15000 },
    { naam: "D",     kort: "D",     aankoop: 5000,  verduurzaming: 15000 },
    { naam: "E",     kort: "E",     aankoop: 0,     verduurzaming: 20000 },
    { naam: "F",     kort: "F",     aankoop: 0,     verduurzaming: 20000 },
    { naam: "G",     kort: "G",     aankoop: 0,     verduurzaming: 20000 },
    { naam: "Geen label of weet ik niet", kort: "Geen label of weet ik niet", aankoop: 0, verduurzaming: 10000 }
  ],

  /* ---------- Scherm 2: Uitkomst ---------- */
  uitkomst: {
    titel: "Jouw check",
    adresKop: "Adres",
    geenAdres: "Geen adres ingevuld",
    labelKop: "Energielabel",

    aankoopKop: "Extra voor aankoop",
    aankoopUitleg: "Dit is het bedrag dat een geldverstrekker je extra mag lenen ten opzichte van een woning met label E, F of G. Het komt bovenop wat je op basis van je inkomen kunt lenen.",

    verduurzamingKop: "Extra voor verduurzaming",
    verduurzamingUitleg: "Dit bedrag mag een geldverstrekker je extra lenen als je het uitgeeft aan energiebesparende maatregelen. Het is een maximum en het is niet verplicht. Het geld staat meestal in een bouwdepot, waaruit de facturen worden betaald. Of en hoe je het krijgt verschilt per geldverstrekker.",

    uitgevenKop: "Waar mag ik dit aan uitgeven?",
    uitgevenGroepen: [
      {
        kop: "Mag",
        soort: "ja",
        items: [
          "Gevelisolatie",
          "Dakisolatie",
          "Vloerisolatie",
          "Leidingisolatie",
          "Isolerend glas (minimaal HR++)",
          "Warmtepomp",
          "Zonnepanelen",
          "Douche met warmteterugwinning"
        ]
      },
      {
        kop: "Mag alleen in combinatie",
        soort: "combi",
        items: [
          "Energiezuinige deuren en kozijnen (alleen samen met HR++ glas)",
          "Energiezuinig ventilatiesysteem (alleen samen met een andere maatregel uit de lijst)"
        ]
      },
      {
        kop: "Valt er niet onder, bijvoorbeeld",
        soort: "nee",
        items: [
          "HR-ketel",
          "Zonneboiler",
          "Thuisbatterij",
          "Vloerverwarming",
          "Rolluiken"
        ]
      }
    ],

    vragenKop: "Vraag dit aan je hypotheekadviseur",
    vragen: [
      "Bij welke geldverstrekkers kan ik het extra bedrag voor verduurzaming krijgen?",
      "Kan ik tot 106% van de woningwaarde lenen als ik verduurzaam?",
      "Hoe werkt het bouwdepot en welke offertes heb ik nodig?",
      "Krijg ik rentekorting bij een beter energielabel?"
    ],

    energieKop: "Schatting energiekosten per maand",
    // Vul hier later zelf een bedrag in, bijvoorbeeld "€ 150".
    energieWaarde: "€ ……",
    energieUitleg: "Per maand",

    rapportKnop: "Bekijk een voorbeeldrapport",

    bron: "Leennormen 2026. Bron: Tijdelijke regeling hypothecair krediet (wetten.overheid.nl) en Volkshuisvesting Nederland. Gecontroleerd op 9 oktober 2026."
  },

  /* ---------- Scherm 3: Voorbeeldrapport ----------
     Alle bedragen hieronder zijn nog leeg ("€ ……") en worden
     op het scherm gemarkeerd als VOORBEELD.
  */
  rapport: {
    titel: "Voorbeeldrapport",
    intro: "Zo ziet een uitgebreid rapport over één woning eruit. Alle bedragen op deze pagina zijn voorbeelden.",
    woning: "Voorbeeldstraat 1, Voorbeeldstad",

    maatregelenKop: "Maatregelen die het meeste opleveren",
    maatregelen: [
      { naam: "Dakisolatie",                    besparing: "€ …… per maand" },
      { naam: "Isolerend glas (minimaal HR++)", besparing: "€ …… per maand" },
      { naam: "Warmtepomp",                     besparing: "€ …… per maand" }
    ],

    kostenKop: "Wat ze kosten",
    kosten: [
      { naam: "Dakisolatie",                    bedrag: "€ ……" },
      { naam: "Isolerend glas (minimaal HR++)", bedrag: "€ ……" },
      { naam: "Warmtepomp",                     bedrag: "€ ……" },
      { naam: "Totaal",                         bedrag: "€ ……" }
    ],

    leenruimteKop: "Hoeveel extra leenruimte ervoor nodig is",
    leenruimte: [
      { naam: "Extra leenruimte nodig voor deze maatregelen", bedrag: "€ ……" }
    ],

    subsidiesKop: "Subsidies",
    subsidies: [
      { naam: "Subsidie (naam volgt)", bedrag: "€ ……" },
      { naam: "Subsidie (naam volgt)", bedrag: "€ ……" }
    ],

    woonlastenKop: "Woonlasten voor en na",
    woonlasten: [
      { naam: "Woonlasten per maand nu",                    bedrag: "€ ……" },
      { naam: "Woonlasten per maand na de maatregelen",     bedrag: "€ ……" }
    ],

    koopKnop: "Ik wil dit rapport (€35)",
    bedankt: "Dankjewel. Het rapport is nog niet te koop. We testen of hier behoefte aan is."
  },

  // Het woord dat bij elke voorbeeldwaarde verschijnt.
  voorbeeldWoord: "VOORBEELD"
};
