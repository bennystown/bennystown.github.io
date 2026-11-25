# Benny's Town – lokaler LIVE-Listener

Ersetzt Tik.Tools. Liest dein TikTok-LIVE **anonym von außen** mit, so wie ein ausgeloggter Zuschauer, und gibt die Events an die Website in OBS weiter.

- **Kein Login.** Keine Cookies, keine Session-ID, kein Passwort von dir. Nur der Benutzername `@bennys.town`.
- **Nur lesen.** Der Listener sendet nie etwas an TikTok: keine Chat-Nachrichten, keine Likes, nichts.
- **Keine Schlüssel im Repo.** Einstellungen gehören in eine lokale `.env`, und die steht in `.gitignore`.

Erfasst werden: **Follows, Likes, Geschenke** (Name, Diamanten, Anzahl, Combo-Ende), **Chat**, **Beitritte**, **Zuschauerzahl** und Teilen.

---

## 1. Installation (einmalig, Mac)

1. Node.js **22.19 oder neuer** installieren:
   ```bash
   brew install node
   ```
   Alternativ den LTS-Installer von https://nodejs.org nehmen. Mit `node -v` prüfen, ob die Version stimmt.
2. Im Terminal in den Ordner wechseln und die Pakete installieren:
   ```bash
   cd ~/…/bennystown.github.io/live-listener
   npm install
   ```
   (`./start.sh` macht das beim ersten Start auch automatisch.)

## 2. Start (vor jedem LIVE)

```bash
cd live-listener
npm start          # oder: ./start.sh
```

Das Fenster bleibt offen und zeigt alle Follows, Geschenke und Chat-Nachrichten. Mit **Ctrl+C** beendest du ihn.

- Bist du noch **nicht live**, wartet er und prüft alle 30 s, ob du online bist. Vor deinem allerersten LIVE meldet TikTok für @bennys.town „user not found“. Das ist normal.
- **Bricht die Verbindung ab**, verbindet er sich automatisch neu.
- Endet das LIVE, schließt er die Logdatei und wartet auf das nächste LIVE.

**Dashboard:** http://localhost:21214 (im Browser öffnen oder als OBS-Dock: *Docks → Benutzerdefinierte Browser-Docks*)

| Bereich | Inhalt |
|---|---|
| Kopfzeile | Verbindungsstatus, LIVE-Dauer, ob OBS/Website verbunden ist |
| Große Zahlen | neue Follower, **dein Gewinn ca. in €**, Zuschauer jetzt (+ Höchststand), Likes |
| Kleine Zahlen | Geschenke, Diamanten, Chat, Beitritte, Geteilt, Benny's Bank (Story-Geld, 10 ¢ pro Follow) |
| Diagramme | Zuschauer im Verlauf, neue Follower pro Minute (mit Hover) |
| Listen | neue Follower in Einzugsreihenfolge (Knopf „Namen kopieren“), Top-Unterstützer, Geschenke nach Art |
| Gewinn-Rechnung | was Zuschauer ausgegeben haben, was TikTok behält, dein Anteil |
| Live-Feed | letzte Events, filterbar |

**Vergangene LIVEs:** Oben im Dashboard steht eine Liste aller LIVEs (aus den Logdateien) mit Dauer, Followern, Diamanten, Gewinn ca., Zuschauer-Höchststand und Likes. Antippen zeigt alle Zahlen, Diagramme, Follower, Unterstützer und den Feed dieses LIVEs. Endet ein LIVE, bleiben seine Zahlen stehen („LIVE beendet · 14:17–14:56 · 38 min“), bis das nächste beginnt. Ist gerade kein LIVE, zeigt das Dashboard automatisch das letzte.

Startest du den Listener neu, während das LIVE noch läuft, stellt er alle Zahlen aus der Logdatei wieder her. Nachrichten, die TikTok nach dem Neuverbinden noch einmal schickt, erkennt er an der Nachrichten-ID und zählt sie nicht doppelt.

### Wie der Gewinn geschätzt wird
TikTok veröffentlicht keine offiziellen Kurse. Die Rechnung im Dashboard nutzt die üblichen Richtwerte:
- Ein Geschenk mit N 💎 kostet den Zuschauer N Coins, ca. **0,0125 € pro Coin** (`COIN_EUR`).
- Du bekommst davon etwa die Hälfte, ca. **0,005 $ ≈ 0,0045 € pro 💎** (`DIAMOND_EUR`).
- Steuern sind nicht abgezogen. Ausgezahlt wird erst ab 10.000 💎. Je nach Land und Agentur kann es weniger sein.
- Die echten Werte siehst du in der TikTok-App unter LIVE-Belohnungen. Passen sie nicht, trag sie in `.env` ein.

## 3. OBS-URL

Browser-Quelle „Stadt“:

```
https://bennystown.github.io/?live&gh=<GITHUB_TOKEN>&ws=ws://localhost:21213
```

`&ws=` ersetzt `&key=` (Tik.Tools). Den GitHub-Token nur in OBS eintragen und nie posten.

Was die Website mit den Events macht:

| Event | Wirkung |
|---|---|
| `follow` | Haus wird gebaut (Warteschlange, +10¢) |
| `gift` | unter 10 💎 Konfetti, 10–99 💎 Herzen, ab 100 💎 Feuerwerk (bei Combos erst am Combo-Ende) |
| `like` | kleine Herzen unten rechts, **kein** Haus, kein Ton |
| `chat` „!house“ / „!haus“ | Kamera fliegt zum Haus (nur mit Ausrufezeichen) |
| `join`, `viewers`, `share`, `status` | werden von der Website ignoriert, stehen aber im Log und auf der Statusseite |

## 4. Testen mit einem fremden LIVE

Nimm irgendeinen Account, der **gerade** live ist:

```bash
npm run test-live -- lofigirl        # oder: ./start.sh lofigirl
```

Zusätzlich die Website lokal oder online mit `?live&ws=ws://localhost:21213` öffnen. Dann siehst du die fremden Follows als Häuser einziehen.
Wichtig: Für den Test **ohne `&gh=`** öffnen, sonst landen die fremden Follower in `live.json`.

**Demo ganz ohne TikTok** (Fake-Events alle 2,5 s, Namen `test_…`):

```bash
npm run mock
```

## 5. Nach dem LIVE: Follower in die Website eintragen

Jedes LIVE bekommt eine eigene Logdatei im JSON-Lines-Format:
`logs/bennys.town/<Datum>_<Uhrzeit>_<RoomId>.jsonl`. Pro Zeile steht ein Event mit Zeitstempel.

Follower in der richtigen Reihenfolge ausgeben (Doppelte entfernt):

```bash
npm run follows                          # neuestes LIVE von @bennys.town
npm run follows -- --json                # als JSON-Array
npm run follows -- logs/bennys.town/….jsonl
```

Follows, die im selben LIVE doppelt kommen (z. B. entfolgen und wieder folgen), werden nur einmal an die Website geschickt. Im Log stehen sie mit `"dup":true`.

## 6. Einstellungen (optional)

`cp .env.example .env` und dann anpassen:

| Variable | Standard | Bedeutung |
|---|---|---|
| `TIKTOK_USER` | `bennys.town` | wessen LIVE gelesen wird |
| `WS_PORT` / `STATUS_PORT` | `21213` / `21214` | lokale Ports |
| `ENGINE` | leer (= `piratetok`) | `piratetok` oder `connector`, siehe unten |
| `EULER_API_KEY` | leer | nur für `connector`: kostenloser Euler-Key für höhere Limits |
| `OFFLINE_CHECK_SECONDS` | `30` | Prüfabstand, solange du offline bist |
| `DIAMOND_EUR` | `0.0045` | dein Anteil pro 💎 in € (für „Gewinn ca.“) |
| `COIN_EUR` | `0.0125` | was ein Zuschauer ca. pro Coin zahlt |

Weitere Schalter: `--debug` (zeigt auch Likes und Beitritte im Terminal) und `--engine connector`.

---

## 7. Welche Bibliothek, und braucht sie einen fremden Dienst?

Kurz: **Standardmäßig braucht der Listener keinen fremden Dienst.** Als Reserve ist eine zweite Bibliothek eingebaut, und die braucht einen.

### Standard: `piratetok-live-js` (ohne fremden Dienst)
- Verbindet sich **direkt** mit TikTok. Kein Signatur-Server, kein API-Key, kein Konto.
- TikTok gibt dabei nur ein anonymes Besucher-Cookie (`ttwid`) aus, wie jedem ausgeloggten Browser. Deine Cookies werden **nie** verwendet.
- Am 16.11. getestet und läuft stabil: Follows, Likes, Geschenke inkl. Combos, Chat, Beitritte, Zuschauer.
- **Nachteil:** Die Bibliothek ist jung (seit April 2026) und hat nur einen Entwickler. Wenn TikTok etwas ändert, kann sie kurzzeitig ausfallen.

### Reserve: `tiktok-live-connector` (die bekannte, bewährte Bibliothek)
- Braucht für den Verbindungsaufbau den **Signatur-Dienst von Euler Stream** (eulerstream.com, Betreiber ist der Maintainer der Bibliothek). TikTok verlangt für die LIVE-Verbindung eine kryptografische Signatur. Die rechnet Euler auf seinem Server aus, damit die Bibliothek TikToks wechselnden Code nicht selbst nachbauen muss.
- **Kosten (Stand 16.11.2026, eulerstream.com/pricing):**

  | Tarif | Preis | Anfragen/Tag | LIVE-Räume/Tag | gleichzeitige WebSockets |
  |---|---|---|---|---|
  | Community | 0 € | 1.500 | 100 | 25 |
  | Business 10K | 50 $/Monat | 10.000 | 1.000 | 100 |

  Für ein LIVE reicht der Gratistarif locker: Ein Verbindungsaufbau kostet nur wenige Anfragen. Ohne Key gilt ein anonymes Community-Kontingent. Mit kostenlosem Konto + `EULER_API_KEY` in `.env` wird es großzügiger.
- **Einschränkung:** Die Geschenkliste (`enableExtendedGiftInfo`) braucht laut Euler einen **Bezahltarif**. Deshalb ist sie abgeschaltet. Name und Diamanten stehen aber sowieso in jedem Geschenk-Event.
- An Euler gehen nur der Benutzername und Raum-Infos, **nie** Login-Daten (`authenticateWs` bleibt aus).
- Die Offline-Prüfung („bin ich schon live?“) läuft direkt über TikTok und verbraucht kein Euler-Kontingent.
- Der Listener nutzt sie **automatisch**, wenn `piratetok` dreimal hintereinander scheitert. Fest einstellen geht mit `ENGINE=connector`.

### Warum nicht immer ganz ohne fremden Dienst?
Die bewährten Bibliotheken (TikTok-Live-Connector für Node, TikTokLive für Python) lagern die Signatur bewusst an Euler aus. TikTok ändert diese Signatur regelmäßig, und ein zentraler Dienst kann das schnell nachziehen. `piratetok-live-js` zeigt, dass es derzeit auch ohne geht: Die öffentliche Web-Verbindung von TikTok nimmt Zuschauer mit dem anonymen `ttwid`-Cookie auch ohne Signatur an. Ob das so bleibt, entscheidet TikTok. Deshalb ist die Reserve eingebaut.

## 8. Dateien

| Datei | Zweck |
|---|---|
| `listener.js` | Hauptprogramm: WebSocket-Server, Statusseite, Logdateien, Neuverbinden |
| `engines/piratetok.js` | Anbindung piratetok-live-js (Standard) |
| `engines/connector.js` | Anbindung tiktok-live-connector (Reserve) |
| `dashboard.html` | Dashboard (http://localhost:21214) |
| `follows.js` | Follower aus einer Logdatei auslesen |
| `start.sh` | Start mit automatischer Erstinstallation |
| `.env.example` | Vorlage für die lokale `.env` (wird nicht committet) |

Hinweis: Beide Bibliotheken sind inoffiziell (Reverse Engineering). Einen offiziellen Weg, LIVE-Events zu lesen, bietet TikTok nicht.
