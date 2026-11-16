// Benny's Town – lokaler TikTok-LIVE-Listener
// -------------------------------------------------------------
// Liest ein TikTok-LIVE anonym von außen (wie ein ausgeloggter Zuschauer),
// nur über den Benutzernamen. KEIN Login, KEINE Cookies, KEINE Session-ID,
// es wird NIE etwas gesendet oder gepostet.
//
// Ausgabe:
//   ws://localhost:21213      Events für die Website (?live&ws=ws://localhost:21213)
//   http://localhost:21214    Statusseite
//   logs/<user>/*.jsonl       ein Log pro LIVE (JSON-Lines)
//
// Bibliotheken: piratetok-live-js (Standard, ohne fremden Dienst) und als Reserve
// tiktok-live-connector (braucht den Signatur-Dienst von Euler Stream). Siehe README.
//
// Start:   npm start                       (liest @bennys.town)
// Test:    npm run test-live -- <username> (beliebiges anderes LIVE)
// Demo:    npm run mock                    (Fake-Events, ohne TikTok)

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';

const DIR = path.dirname(fileURLToPath(import.meta.url));

// ---------- Konfiguration (.env optional) ----------
function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}
loadEnv(path.join(DIR, '.env'));

const argv = process.argv.slice(2);
const flag = n => argv.includes(n);
const opt = n => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : null; };
const positional = argv.find((a, i) => !a.startsWith('--') && !['--user', '--engine'].includes(argv[i - 1]));

const MOCK = flag('--mock');
const DEBUG = flag('--debug');
const USER = String(opt('--user') || positional || process.env.TIKTOK_USER || 'bennys.town')
  .trim().replace(/^https?:\/\/(www\.)?tiktok\.com\//, '').replace(/^@/, '').replace(/\/live\/?$/, '');
const WS_PORT = +(process.env.WS_PORT || 21213);
const STATUS_PORT = +(process.env.STATUS_PORT || 21214);
const OFFLINE_CHECK = Math.max(30, +(process.env.OFFLINE_CHECK_SECONDS || 30)) * 1000;
const EULER_API_KEY = (process.env.EULER_API_KEY || '').trim() || undefined;
const ENGINE_FIXED = !!(opt('--engine') || process.env.ENGINE);
const ENGINE = String(opt('--engine') || process.env.ENGINE || 'piratetok').toLowerCase();

// ---------- Hilfen ----------
const sleep = ms => new Promise(r => setTimeout(r, ms));
const now = () => new Date().toISOString();
const clean = v => JSON.parse(JSON.stringify(v ?? null, (k, x) => (typeof x === 'bigint' ? x.toString() : x)));
const num = v => (v == null || v === '' ? undefined : Number(v));
const userOf = d => {
  const u = d?.user || {};
  return { uniqueId: u.uniqueId || u.unique_id || d?.uniqueId || '', nickname: u.nickname || d?.nickname || '' };
};
const stamp = () => new Date().toLocaleString('sv-SE').replace(' ', '_').replace(/:/g, '-');
function log(...a) { console.log(new Date().toLocaleTimeString('de-DE'), ...a); }

// ---------- Status ----------
const S = {
  user: USER, mode: MOCK ? 'mock' : 'live', state: 'starting', since: now(), roomId: null, title: null,
  viewers: null, totalLikes: null, lastError: null, logFile: null, wsClients: 0, connects: 0,
  counts: { follow: 0, like: 0, gift: 0, diamonds: 0, chat: 0, join: 0, share: 0 },
  recent: [], engine: MOCK ? 'Demo' : null
};
function setState(state, err) {
  if (S.state !== state) { S.state = state; S.since = now(); log('Status:', state, err ? '– ' + err : ''); }
  if (err !== undefined) S.lastError = err;
  broadcast({ event: 'status', data: { state, user: USER, roomId: S.roomId, error: err || null } });
}

// ---------- Logdatei pro LIVE ----------
let logStream = null, logRoom = null;
function openLog(roomId) {
  if (logStream && logRoom === roomId) return; // gleiches LIVE nach Reconnect -> weiter in dieselbe Datei
  if (logStream) logStream.end();
  const dir = path.join(DIR, 'logs', MOCK ? 'mock' : USER);
  fs.mkdirSync(dir, { recursive: true });
  const existing = fs.readdirSync(dir).find(f => f.endsWith('_' + roomId + '.jsonl'));
  const file = path.join(dir, existing || `${stamp()}_${roomId}.jsonl`);
  logStream = fs.createWriteStream(file, { flags: 'a' }); logRoom = roomId; S.logFile = path.relative(DIR, file);
  log('Logdatei:', S.logFile);
}
function writeLog(obj) { if (logStream) logStream.write(JSON.stringify({ t: now(), ...obj }) + '\n'); }

// ---------- WebSocket-Server für die Website ----------
const wss = new WebSocketServer({ host: '127.0.0.1', port: WS_PORT });
wss.on('connection', sock => {
  S.wsClients = wss.clients.size;
  log('Website verbunden (' + S.wsClients + ' Client' + (S.wsClients > 1 ? 's' : '') + ')');
  sock.send(JSON.stringify({ event: 'status', data: { state: S.state, user: USER, roomId: S.roomId } }));
  if (S.state === 'connected') sock.send(JSON.stringify({ event: 'connected', data: { roomId: S.roomId } }));
  sock.on('close', () => { S.wsClients = wss.clients.size; });
  sock.on('message', () => {}); // Eingaben werden ignoriert – der Listener sendet nie etwas an TikTok
});
wss.on('error', e => { console.error('WebSocket-Port ' + WS_PORT + ' belegt? ', e.message); process.exit(1); });
function broadcast(msg) {
  const s = JSON.stringify(msg);
  for (const c of wss.clients) if (c.readyState === 1) c.send(s);
}

// ---------- Event an Website + Log + Statusseite ----------
const followSeen = new Set();
function emit(event, data, extra = {}) {
  const msg = { event, data: clean(data) };
  writeLog({ ...msg, ...extra });
  if (!extra.dup) broadcast(msg);
  if (event in S.counts) S.counts[event]++;
  if (event === 'gift' && data.repeatEnd) S.counts.diamonds += (data.diamondCount || 0) * (data.repeatCount || 1);
  if (event === 'like' && data.totalLikeCount != null) S.totalLikes = data.totalLikeCount;
  if (event === 'viewers') { S.viewers = data.viewerCount; return; } // nicht in die Liste
  S.recent.unshift({ t: now(), event, data: msg.data, ...extra });
  if (S.recent.length > 80) S.recent.length = 80;
  if (DEBUG || (event !== 'like' && event !== 'join')) {
    const u = data.user ? '@' + data.user.uniqueId : '';
    const info = event === 'gift' ? `${data.giftName} ×${data.repeatCount} (${data.diamondCount}💎)${data.giftType === 1 ? (data.repeatEnd ? ' [Combo-Ende]' : ' [Combo läuft]') : ''}`
      : event === 'chat' ? `„${data.comment}“` : event === 'like' ? `+${data.likeCount}` : '';
    log(event.toUpperCase().padEnd(6), u, info, extra.dup ? '(doppelt, nicht weitergeleitet)' : '');
  }
}

// ---------- TikTok-Verbindung ----------
// Nur falls ein Netzwerk-Proxy gesetzt ist (z. B. Firmen-/Cloud-Netz). Auf dem Mac normalerweise leer -> direkt.
const PROXY = process.env.HTTPS_PROXY || process.env.https_proxy || '';
if (PROXY) log('Nutze Proxy aus HTTPS_PROXY');
let stopping = false;

function emitFollow(user) {
  const key = user.uniqueId.toLowerCase();
  const dup = followSeen.has(key); followSeen.add(key);
  emit('follow', { user }, dup ? { dup: true } : {});
}

const ctx = {
  USER, PROXY, OFFLINE_CHECK, EULER_API_KEY, S,
  setState, emit, emitFollow, userOf, num,
  isStopping: () => stopping,
  onConnected(roomId, title) {
    S.roomId = roomId; S.title = title; S.connects++;
    openLog(roomId);
    writeLog({ event: '_connected', data: { user: USER, roomId, title, engine: S.engine } });
    setState('connected', null);
    broadcast({ event: 'connected', data: { roomId } });
  },
  onDisconnected(reason) {
    writeLog({ event: '_disconnected', data: { reason } });
    if (reason === 'streamEnd') {
      log('LIVE beendet.');
      if (logStream) { logStream.end(); logStream = null; logRoom = null; }
      followSeen.clear(); S.roomId = null;
      setState('offline', null);
      return OFFLINE_CHECK;
    }
    if (reason === 'stop') return 0;
    setState('reconnecting', 'Verbindung abgebrochen (' + reason + ') – verbinde neu');
    return 3000;
  }
};

async function mainLoop() {
  const engines = { piratetok: await import('./engines/piratetok.js'), connector: await import('./engines/connector.js') };
  let current = engines[ENGINE] ? ENGINE : 'piratetok', fails = 0;
  S.engine = engines[current].name;
  while (!stopping) {
    const wait = await engines[current].session(ctx);
    if (stopping) break;
    fails = S.state === 'error' ? fails + 1 : 0;
    // Automatischer Wechsel auf die andere Bibliothek, wenn eine 3× hintereinander scheitert
    // (nur wenn ENGINE nicht fest gesetzt ist).
    if (fails >= 3 && !ENGINE_FIXED) {
      current = current === 'piratetok' ? 'connector' : 'piratetok';
      S.engine = engines[current].name; fails = 0;
      log('Wechsle auf Engine:', S.engine);
      continue;
    }
    await sleep(Math.min(wait * Math.max(1, fails), 10 * 60000));
  }
}

// ---------- Demo-Modus ----------
async function mockLoop() {
  const names = ['test_anna', 'test_ben', 'test_cleo', 'test_dave', 'test_emil', 'test_fynn'];
  const gifts = [['Rose', 1, 1], ['GG', 1, 1], ['Doughnut', 30, 0], ['Hand Hearts', 100, 0], ['Galaxy', 1000, 0]];
  S.roomId = 'mock'; openLog('mock'); setState('connected', null);
  broadcast({ event: 'connected', data: { roomId: 'mock' } });
  let i = 0;
  while (!stopping) {
    await sleep(2500);
    const u = { uniqueId: names[i % names.length] + '_' + (100 + i), nickname: 'Test ' + i };
    const r = i % 6;
    if (r === 0) emit('follow', { user: u });
    else if (r === 1) emit('like', { user: u, likeCount: 5, totalLikeCount: 100 + i * 5 });
    else if (r === 2) emit('chat', { user: u, comment: i % 12 === 2 ? 'house' : 'hello benny 👋' });
    else if (r === 3) {
      const [giftName, diamondCount, giftType] = gifts[(i / 6 | 0) % gifts.length];
      if (giftType === 1) emit('gift', { user: u, giftName, diamondCount, repeatCount: 3, repeatEnd: false, giftType });
      emit('gift', { user: u, giftName, diamondCount, repeatCount: giftType === 1 ? 5 : 1, repeatEnd: true, giftType });
    } else if (r === 4) emit('join', { user: u });
    else emit('viewers', { viewerCount: 10 + (i % 7) });
    i++;
  }
}

// ---------- Statusseite ----------
const PAGE = fs.readFileSync(path.join(DIR, 'status.html'), 'utf8');
http.createServer((req, res) => {
  if (req.url.startsWith('/status.json')) {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
    return res.end(JSON.stringify({ ...S, wsPort: WS_PORT, now: now() }));
  }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
  res.end(PAGE);
}).on('error', e => { console.error('Status-Port ' + STATUS_PORT + ' belegt? ', e.message); process.exit(1); })
  .listen(STATUS_PORT, '127.0.0.1');

// ---------- Start / Stop ----------
console.log(`
  Benny's Town LIVE-Listener ${MOCK ? '(DEMO-MODUS – Fake-Events)' : ''}
  TikTok:      @${USER}  (anonym, nur lesen)
  Bibliothek:  ${MOCK ? 'Demo' : ENGINE_FIXED ? ENGINE : 'piratetok (Reserve: connector)'}
  Website-WS:  ws://localhost:${WS_PORT}
  Status:      http://localhost:${STATUS_PORT}
  Beenden:     Ctrl+C
`);
async function shutdown() {
  if (stopping) process.exit(0);
  stopping = true; log('Beende …');
  // Die Engine merkt „stopping“ innerhalb von 1 s und trennt die TikTok-Verbindung sauber.
  setTimeout(() => { if (logStream) logStream.end(); process.exit(0); }, 1500);
}
process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown);
process.on('unhandledRejection', e => { S.lastError = String(e?.message || e); log('Fehler:', S.lastError); });

(MOCK ? mockLoop() : mainLoop()).catch(e => { console.error(e); process.exit(1); });
