#!/bin/bash
# Startet den Benny-LIVE-Listener. Installiert beim ersten Mal die Pakete.
#   ./start.sh                 -> @bennys.town
#   ./start.sh <username>      -> beliebiges anderes LIVE (Test)
#   ./start.sh --mock          -> Demo mit Fake-Events
cd "$(dirname "$0")" || exit 1
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js fehlt. Installiere es mit:  brew install node   (oder https://nodejs.org, LTS)"
  exit 1
fi
if [ ! -d node_modules ]; then
  echo "Installiere Pakete (einmalig) …"
  npm ci --no-audit --no-fund || npm install --no-audit --no-fund || exit 1
fi
exec node listener.js "$@"
