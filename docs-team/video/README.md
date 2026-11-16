# Video-Pipeline – Dateien

Ablauf und Befehle: siehe `../PROJEKT.md`, Abschnitt 4. Hier steht nur, was wo liegt.
Alle Skripte erwarten ihren Arbeitsordner (z. B. `/tmp/ep7`) mit `index.html` (aktuelle Website), `raw.mp3` (TTS) usw. Zum Wiederverwenden: Ordner kopieren und Pfade/Zeiten anpassen.

| Ordner | Video | Wichtigste Dateien |
|---|---|---|
| `common/` | alle | `fontstyle.html` – Poppins inline als Base64 (wird von `mk*.py` eingebaut) |
| `build-video-day3/` | Folge 6, Bauvideo Tag 3 (**Vorlage für Bauvideos**) | `vid.js` Szene/Timeline, `mk_body.py` → buildX.html, `cut.py` + `build_voice.py` Stimme, `prep.py` caps/mouth, `sfx4.py`, `render.py`, `stills.py`, `words_raw.py` |
| `evening-ep6/` | Folge 7, Campervan (**Vorlage für Abendvideos**) | `vid6.js`, `mk6.py`, `voice.py` (Sätze auf Zielzeiten legen), `prep.py`, `sfx6.py`, `render.py`, `stills.py`, `words_raw.py` |
| `evening-ep5/` | Folge 5, Rathaus + Zelt | `vid5.js`, `vidall.js`, `helpers.js`, `mk.py`, `cut.py`, `build_voice.py`, `sfx5.py` |
| `older-episodes/` | Folgen 1–4 | ep1, ep2, Bauvideo Tag 1 + Tag 2 (`build-day2_*`) |
| `follower-ocr/` | Follower aus iPhone-Bildschirmaufnahme | `ocr.py` (tesseract, Zeilen über rote Buttons), `merge.py` (Frames → Liste), `evalocr.py` (Qualitätscheck) |

**Abhängigkeiten:** python3, numpy, Pillow, playwright (Python) + `/usr/bin/google-chrome`, ffmpeg, tesseract.

**Nicht im Repo (absichtlich):** MP3/WAV/MP4 (zu groß; Videos liegen auf Kierans Mac unter `Movies/Benny/Folge N/`), API-Keys. ElevenLabs läuft über den Connector in Kierans Konto.
