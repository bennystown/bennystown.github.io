// Liest eine LIVE-Logdatei und gibt die neuen Follower in der richtigen Reihenfolge aus
// (erster Follow zählt, Doppelte werden entfernt).
//
//   npm run follows                       -> neueste Logdatei von @bennys.town
//   npm run follows -- logs/bennys.town/2026-11-20_20-00-00_123.jsonl
//   npm run follows -- --json             -> als JSON-Array (für die Website)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const asJson = args.includes('--json');
let file = args.find(a => !a.startsWith('--'));
if (!file) {
  const d = path.join(DIR, 'logs', 'bennys.town');
  const all = fs.existsSync(d) ? fs.readdirSync(d).filter(f => f.endsWith('.jsonl')).sort() : [];
  if (!all.length) { console.error('Keine Logdatei gefunden in ' + d); process.exit(1); }
  file = path.join(d, all[all.length - 1]);
}

const seen = new Set(), out = [];
for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
  if (!line.trim()) continue;
  let e; try { e = JSON.parse(line); } catch { continue; }
  if (e.event !== 'follow') continue;
  const u = e.data?.user || {}, k = (u.uniqueId || '').toLowerCase();
  if (!k || seen.has(k)) continue;
  seen.add(k); out.push({ t: e.t, uniqueId: u.uniqueId, nickname: u.nickname || '' });
}

if (asJson) console.log(JSON.stringify(out.map(f => f.uniqueId)));
else {
  console.error(`${out.length} Follower aus ${path.relative(process.cwd(), file)}:`);
  out.forEach((f, i) => console.log(`${String(i + 1).padStart(4)}. ${new Date(f.t).toLocaleTimeString('de-DE')}  @${f.uniqueId}${f.nickname ? '  (' + f.nickname + ')' : ''}`));
}
