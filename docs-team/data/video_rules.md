# Bennys Town – Video-Regeln (vom User)

- Schnelles Tempo, catchy, keine langen Regel-Erklärungen. Benny redet direkt zum Zuschauer und durchgehend.
- Bank groß und mittig, unter der TikTok-Suchleiste (Panel ab y≈260).
- Klein und dauerhaft unter der Bank: "Follow = you move in 🏠".
- Kaufoptionen immer mit Preis, Poll-Optionen max. 25 Zeichen.
- Kommentare nur in jedem 4.–5. Video zeigen.
- Bauvideos: ganze Stadt von oben (wie build.js) plus Briefkästen mit Namen plus Bennys Stimme.
- Keine Benny-Untertitel, solange die Namensliste gezeigt wird.
- Neues Follower-Geld erst im Bauvideo am nächsten Morgen, wenn die Leute einziehen, nicht schon im Abendvideo.
- Kein Teaser am Ende vom Abendvideo.
- **Pop-ups/Karten länger stehen lassen**, damit man sie lesen kann (mind. ~1,5–2 s). Endkarte mindestens ~2 s vor Videoende einblenden.
- **Kaufvideos: Benny läuft durch die Stadt, sieht die neuen Häuser und kauft an einem Stand.** Das Produkt kommt nicht zu ihm.
- Keine KI-Kennzeichnung (Entscheidung des Users).

## Website
- Live: https://bennystown.github.io (Repo bennystown/bennystown.github.io, Push aus /home/claude/bennystown.github.io). Quelle: /home/claude/bennys-town/index.html
- Follower-Listen: /home/claude/bennys-town/followers/ (+ Mac Movies/Benny/Follower). Auslesen über TikTok im Browser-Fenster (Follower-Dialog, in kleinen Schritten scrollen).
- Hauswünsche über `color:` im tenants-Eintrag (blue, red, yellowpurple …).

## Welt-Regeln
- Alle Häuser: gleiches einstöckiges Häuschen mit Spitzdach, nur Farben verschieden. Danach kommen Upgrades nach Folgedauer.
- Stände: IN DEN VIDEOS JA. Einige Mieter haben Stände (Brot, Limo, Obst, Kekse, Hotdog, Saft), dort kauft Benny ein. AUF DER WEBSITE NEIN (dort entfernt). Echte Läden kommen später.
- Später werden echte Läden gebaut.

- Stadt-Meilensteine durch Follower (kein Geld nötig): 500 Park, 1.000 Schlüssel-Geheimnis, 2.500 erste Läden, 5.000 Marktplatz/Autos, 10.000 Freizeitpark-Gelände.
- Wetter + Tag/Nacht: ja.
- Taube: feste Nebenfigur, aber nur manchmal, nicht in jedem Video.
- Häuser: alle gleiches Grundmodell, nur Farben unterschiedlich. Upgrades nach Folgedauer (3 Tage, 1 Woche, 2 Wochen, 1 Monat …). Später selbst modifizierbar und Live-Geschenk-Upgrades.

- Layout: jedes Haus auf eigenem Grundstück, Straßen jede 2. Reihe, Querstraßen jede 6., dazwischen Gartenstreifen → kein Haus wird verdeckt.
- Treue-Stufen (nur durch Zeit, NIE durch Live-Geschenke): 3 Tage Blumen, 1 Woche Zaun+Baum, 2 Wochen Laterne+Bank, 1 Monat 2. Stock, 3 Monate Pool, (6 Monate goldener Dachrand, 1 Jahr Denkmal-Schild).
- Live-Geschenke: richtig geile Sachen (z.B. Galaxy = Schloss auf 4 Grundstücken), aber keine Treue-Belohnungen. Großbauten → eigenes Viertel, niemand wird verdrängt.
- Ziel: Login + Haus personalisieren je nach Treue/Geschenken.
- 3D-Ansicht pro Haus auf der Website (three.js, three.min.js im Repo).

- Welt soll nicht zu quadratisch sein: Parks/Sonderflächen mit organischer Form (Blob), dürfen über Straßen gehen (Straßen enden am Spazierweg), Plätze mit abgerundeten Ecken. Nie Überschneidungen. Erst lokal testen + Vorschau zeigen, dann hochladen.
- Nur EIN Park (keine extra Wiesen). Park hält deutlichen Abstand zu Häusern (inPark < 1.75). Häuser ab jetzt möglichst fest auf ihren Plätzen.
- Website-Statistik: GoatCounter (bennystown.goatcounter.com), Script im Footer.
- Layout-Regel: Sonderflächen immer als ganzer Block (6x6, rundum von Straßen eingerahmt), nie mittig gestapelt, sondern ein paar Straßen nach außen (aktuell 1 Häuserblock Abstand), nicht zu weit. Bennys Platz = Block (0,0), Park = Block (2,0), Rathaus = Block (0,2). Nächste Sonderflächen z.B. (-2,0), (0,-2), (2,2).
- Meilensteine (Website: TOWN.milestones): 500 = Park rechts neben Bennys Platz (steht). 1.000 = Schlüssel öffnet Rathaus + kleiner Marktplatz links neben dem Platz (Baustelle bis zum 1.000er-Video, dann townHall: true). Marktplatz = Ort für die Mieter-Stände in den Videos.
- Läden: Eckplätze für Gewerbe später; Läden kommen über Meilensteine (z.B. 2.500) oder Bennys Käufe per Abstimmung, ohne Markennamen.

## Spätere Ideen (noch nicht umsetzen)
- Stadtprojekte, über die abgestimmt wird (z.B. Achterbahn). Preise realistisch: Achterbahn ~€1.000.
- Eigener Charakter direkt auf der Website (Stufe 2 mit Claim-Code/Login). Kein Kommentar-Zwischenschritt. Charaktere können Stadtprojekte benutzen.
- Nächstes Video: kurzer Benny-Satz "Thank you for all the nice messages 🫶" (DMs nicht beantworten, nur im Video danken). DM-Wünsche z.B. 60V_R1der (#~3776) will im Video vorkommen → evtl. "Haus des Tages" zufällig, keine Bevorzugung.
- Sobald die ersten Treue-Upgrades fällig sind (Blumen = 3 Tage → OGs von Tag 1 ab 17.11.), im Bauvideo zeigen: Blumen ploppen bei den Häusern auf + Benny erklärt kurz "the longer you stay, the better your house gets" (Treue-Belohnungen, Liste auf der Website). Ab da bei jeder neuen Stufe (1 Woche Zaun etc.) wieder erwähnen.

## Stand 16.11. (Tag 3)
- TikTok-Website zeigt nur noch die neuesten ~30 Follower → Follower kommen per Handy-Bildschirmaufnahme (Follower-Liste scrollen) + OCR (/tmp/ocr/ocr.py, merge.py). Liste: followers/tenants_2026-11-16.json (4.661). OCR-Fehler möglich → Website-Suche ist fehlertolerant (0/o, 1/l, 5/s).
- Baustellen für nächste Meilensteine reserviert: Blöcke (8,5) und (5,8) ("🚧 BUILDING – COMING SOON"). Grid N=140.
- Abstimmung Tag 3: Campervan €350 / Motorrad €400 / Straßenlaternen €200 (Bank €625,70 → Campervan+Motorrad zusammen zu teuer).
- TODO Tag 4 (17.11.): Blumen bei den 34 Tag-1-Häusern auch in der 2D-Website zeichnen + im Video zeigen. Meilenstein 5.000 naht.

## LIVE (seit 16.11.)
- Szene: bennystown.github.io/?live&key=TIKTOOLS_KEY&gh=GITHUB_TOKEN (nur in OBS). Steuerpult: ?control (OBS-Dock).
- Follows via tik.tools WebSocket → Warteschlange → Haus-Bauanimation. Chat "house" → Kamera zum Haus. Geschenke → Effekte.
- Live-Follower werden alle 45 s in live.json (Repo) geschrieben ({base, names}); Website lädt live.json und baut die Häuser dazu.
- MORGEN-UPDATE: ZUERST live.json-Namen in Live-Reihenfolge an tenants anhängen (gleiche Grundstücke!), DANN restliche neue Follower. Danach live.json auf {"base": neue Zahl, "names": []} zurücksetzen. Kein Update während eines LIVEs.
- Meilensteine: 5.000 Marktplatz+Läden+Autos (Block 8,5), 10.000 Achterbahn (5,8), 15.000 Brunnen + Benny-Statue (10,10). Erscheinen automatisch ab Bewohnerzahl; im LIVE mit Bau-Sequenz + Benny-Clip (ms5/ms10/ms15). Danach: 20.000 "Surprise" (noch festlegen).
- Geschenk-Haus-Upgrades: erst nach dem ersten LIVE besprechen.
- mk_body.py (Videos) nutzt jetzt HOUSES.length statt N in der Grundstücks-Schleife.
- 16.11. Relayout: Baustellen jetzt näher an der Mitte: (-4,-4) oben = Marktplatz 5k, (-5,0) oben links = Achterbahn 10k, (0,-5) oben rechts = Brunnen 15k. Alte Baustellen (8,5),(5,8),(10,10) sind jetzt Parks. 27 Häuser, die auf den neuen Baustellen standen, sind an den Stadtrand umgezogen (LOTA, LOT_FREEZE=4661). Häuser-Nummern bleiben gleich.
