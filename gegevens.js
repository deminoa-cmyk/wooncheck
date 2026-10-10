/*
  GEGEVENS VOOR LABELRUIMTE
  =========================
  In dit bestand staan alle bedragen, lijsten en vaste teksten van de app.
  Wil je iets aanpassen? Verander alleen de tekst tussen de aanhalingstekens
  of het getal. Laat komma's, haakjes en aanhalingstekens staan.

  Bron leennormen: Tijdelijke regeling hypothecair krediet
  (wetten.overheid.nl) en Volkshuisvesting Nederland.
  Leennormen 2026. Gecontroleerd op 9 oktober 2026.

  Bedragen staan in hele euro's, zonder punt (dus 20000, niet 20.000).
  Een tekst die leeg is ("") wordt niet getoond.
*/

window.GEGEVENS = {

  /* ---------- Algemeen ---------- */
  appNaam: "Labelruimte",

  // Eén zin onder de naam bovenaan: wie maakt Labelruimte en waarom.
  // Nog leeg, vul hem zelf in.
  kopregel: "",

  disclaimer: "Dit is een schatting en geen financieel advies. Vraag een hypotheekadviseur naar je maximale hypotheek.",

  terugKnop: "Terug",

  // Wordt voorgelezen bij links die in een nieuw tabblad openen.
  nieuwTabblad: "(opent in een nieuw tabblad)",

  /* ---------- Scherm 1: Start ---------- */
  start: {
    titel: "Wat betekent het energielabel voor je hypotheek?",
    // Jouw introductie, maximaal twee zinnen. Nog leeg, vul hem zelf in.
    intro: "",
    punten: [
      "Zie wat het energielabel doet met je leenruimte",
      "Zie waar je extra geld voor verduurzaming aan mag uitgeven",
      "Krijg vragen mee voor je hypotheekadviseur"
    ],
    duur: "Invullen duurt minder dan een minuut.",
    adresLabel: "Adres van de woning",
    postcodeLabel: "Postcode",
    postcodeVoorbeeld: "1234 AB",
    huisnummerLabel: "Huisnummer",
    huisnummerVoorbeeld: "12 of 12A",
    straatLabel: "Straat",
    woonplaatsLabel: "Woonplaats",
    // Straat en woonplaats worden automatisch ingevuld via PDOK, de
    // kaartendienst van de overheid. Alleen postcode en huisnummer gaan
    // daarheen. Het energielabel komt van EP-Online (ook overheid).
    adresUitleg: "We zoeken je adres op bij PDOK en het energielabel bij EP-Online, allebei diensten van de overheid. We bewaren je adres niet.",
    adresZoeken: "Adres zoeken…",
    adresGevonden: "Adres gevonden.",
    adresKiezen: "Op dit huisnummer staan meer adressen. Kies het juiste adres:",
    adresNietGevonden: "We vinden dit adres niet. Controleer de postcode en het huisnummer. Je kunt ook zonder adres verder.",
    adresFout: "Het adres opzoeken lukt nu niet. Je kunt gewoon verder.",

    // Het tussenstation dat het energielabel opzoekt bij EP-Online.
    // Staat hier "" (leeg), dan wordt het label niet automatisch opgezocht.
    // {label} en {datum} worden vervangen door het label en de datum.
    labelDienst: "https://wooncheck-label.deminoa.workers.dev",
    labelZoeken: "Energielabel zoeken…",
    // Het blok dat verschijnt als het label is gevonden:
    // "Op basis van EP-Online (…) is het energielabel voor deze woning:"
    labelBronVoor: "Op basis van ",
    labelBronNaam: "EP-Online",
    labelBronLink: "https://www.ep-online.nl/",
    labelBronNa: " (de officiële registratie van energielabels van de overheid) is het energielabel voor deze woning:",
    labelGeldigTot: "Geldig tot {datum}",
    labelVerlopen: "Het laatste label ({label}) is verlopen op {datum}.",
    labelAnders: "Ander label kiezen",
    labelNietGevonden: "Voor dit adres is geen energielabel geregistreerd. Kies hieronder zelf een label.",
    labelFout: "Het energielabel opzoeken lukt nu niet. Kies het label hieronder zelf.",
    // Kopjes boven de drie groepen keuzeknoppen.
    labelGroepen: ["A tot en met G", "Beter dan A", "Overig"],
    labelVraag: "Energielabel van de woning",
    opzoekenTekst: "Weet je het label niet? Zoek het op",
    opzoekenLink: "https://www.energielabel.nl/woningen/zoek-je-energielabel/",
    knop: "Bekijk mijn check",
    meldingGeenLabel: "Kies eerst een energielabel.",
    meldingWeetNiet: "Zoek eerst het label op via de link hieronder."
  },

  /* ---------- Leennormen 2026 (in euro's) ----------
     Volgorde = volgorde van de keuzeknoppen.
     naam          = tekst op de keuzeknop
     kort          = tekst op scherm 2
     aankoop       = extra voor aankoop (null = geen bedrag, toon zin)
     verduurzaming = extra voor verduurzaming
     rij: 2        = knop op de tweede rij (labels boven A)
     breed: true   = brede knop over de hele regel
     weetNiet: true = niet doorgaan, maar melding tonen
  */
  labels: [
    { naam: "A",     kort: "A",     aankoop: 10000, verduurzaming: 10000 },
    { naam: "B",     kort: "B",     aankoop: 10000, verduurzaming: 10000 },
    { naam: "C",     kort: "C",     aankoop: 5000,  verduurzaming: 15000 },
    { naam: "D",     kort: "D",     aankoop: 5000,  verduurzaming: 15000 },
    { naam: "E",     kort: "E",     aankoop: 0,     verduurzaming: 20000 },
    { naam: "F",     kort: "F",     aankoop: 0,     verduurzaming: 20000 },
    { naam: "G",     kort: "G",     aankoop: 0,     verduurzaming: 20000 },
    { naam: "A+",    kort: "A+",    aankoop: 20000, verduurzaming: 10000, rij: 2 },
    { naam: "A++",   kort: "A++",   aankoop: 20000, verduurzaming: 10000, rij: 2 },
    { naam: "A+++",  kort: "A+++",  aankoop: 25000, verduurzaming: 0, rij: 2 },
    { naam: "A++++", kort: "A++++", aankoop: 30000, verduurzaming: 0, rij: 2 },
    { naam: "A++++ met energieprestatiegarantie van minimaal tien jaar", kort: "A++++ met garantie", aankoop: 40000, verduurzaming: 0, breed: true },
    { naam: "Geen (geldig) energielabel", kort: "Geen (geldig) energielabel", aankoop: null, verduurzaming: 10000, breed: true },
    { naam: "Weet ik niet", kort: "Weet ik niet", weetNiet: true, breed: true }
  ],

  /* ---------- Scherm 2: Uitkomst ---------- */
  uitkomst: {
    titel: "Jouw check",
    adresKop: "Adres",
    geenAdres: "Geen adres ingevuld",
    labelKop: "Energielabel",

    aankoopKop: "Extra voor aankoop",
    aankoopUitleg: "Dit is het bedrag dat een geldverstrekker je extra mag lenen vergeleken met een woning met label E, F of G. Het komt bovenop wat je op basis van je inkomen kunt lenen.",
    // Staat op de plek van het bedrag bij "Geen (geldig) energielabel".
    aankoopGeenLabel: "De regeling noemt geen extra bedrag voor een woning zonder label.",

    verduurzamingKop: "Extra voor verduurzaming",
    verduurzamingPunten: [
      "Dit bedrag mag een geldverstrekker je extra lenen als je het uitgeeft aan energiebesparende maatregelen. Het is een maximum en het is niet verplicht.",
      "Het geld staat meestal in een bouwdepot, waaruit de rekeningen worden betaald.",
      "Een geldverstrekker mag dit doen, maar hoeft het niet. De voorwaarden verschillen per geldverstrekker."
    ],

    // Uitleg bij moeilijke woorden. Bij het eerste gebruik op scherm 2
    // verschijnt een knopje "Wat is dit?".
    watIsDitKnop: "Wat is dit?",
    begrippen: [
      { woord: "geldverstrekker", uitleg: "De bank of andere partij die je de hypotheek geeft." },
      { woord: "bouwdepot", uitleg: "Een aparte rekening bij je hypotheek waaruit de rekeningen van de verbouwing worden betaald." },
      { woord: "energiebesparende maatregelen", uitleg: "Aanpassingen waardoor je huis minder energie verbruikt, zoals isolatie." },
      { woord: "woningwaarde", uitleg: "Wat het huis volgens een taxateur waard is." }
    ],

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
      "Krijg ik rentekorting bij een beter energielabel?",
      "Wat doet mijn studieschuld met wat ik kan lenen?"
    ],

    energieKop: "Schatting energiekosten per maand",
    // Vul hier later zelf een bedrag in, bijvoorbeeld "€ 150".
    energieWaarde: "€ ……",
    energieUitleg: "Per maand",

    rapportKnop: "Bekijk een voorbeeldrapport",

    // Knop om de uitkomst te bewaren of te delen. Er wordt niets
    // opgeslagen of naar een server gestuurd.
    deelKnop: "Bewaar of deel deze uitkomst",
    deelGekopieerd: "De samenvatting is gekopieerd. Je kunt hem nu ergens plakken, bijvoorbeeld in een notitie of bericht.",
    deelMislukt: "Kopiëren lukte niet. Selecteer de tekst hieronder en kopieer hem zelf.",

    // De bronregel: tekst ervoor, twee links, tekst erna.
    bron: {
      voor: "Leennormen 2026. Bron: ",
      links: [
        { tekst: "Tijdelijke regeling hypothecair krediet", link: "https://wetten.overheid.nl/BWBR0032503/2026-01-01" },
        { tekst: "Volkshuisvesting Nederland", link: "https://www.volkshuisvestingnederland.nl/onderwerpen/huren-en-wonen/tijdelijke-regeling-hypothecair-krediet/maximale-hypotheek-op-basis-van-energielabel" }
      ],
      tussen: " en ",
      na: ". Gecontroleerd op 9 oktober 2026."
    }
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
