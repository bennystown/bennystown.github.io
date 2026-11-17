// Engine „piratetok“ (Standard): piratetok-live-js
// Verbindet sich direkt mit TikTok – ohne Signatur-Dienst, ohne API-Key, ohne Login.
// TikTok gibt dabei nur ein anonymes Besucher-Cookie (ttwid) aus, wie bei jedem
// ausgeloggten Browser. Es werden KEINE Cookies von dir verwendet (.cookies() wird nie aufgerufen).
import { TikTokLiveClient, EventType, checkOnline, HostNotOnlineError, UserNotFoundError, isComboGift, isStreakOver } from 'piratetok-live-js';

export const name = 'piratetok (direkt, ohne Signatur-Dienst)';

const mid = d => d?.common?.msgId ?? d?.msgId ?? null;

export async function session(ctx) {
  const { USER, PROXY, OFFLINE_CHECK, setState, emit, emitFollow, onConnected, isStopping, userOf, num } = ctx;

  setState('checking');
  try {
    await checkOnline(USER, 10000, undefined, undefined, PROXY || undefined);
  } catch (e) {
    if (e instanceof HostNotOnlineError) { setState('offline', null); return OFFLINE_CHECK; }
    if (e instanceof UserNotFoundError) {
      // TikTok meldet „user not found“ auch für Konten, die noch nie live waren.
      setState('offline', `@${USER}: noch kein LIVE gefunden (TikTok: user not found). Schreibweise prüfen – sonst normal vor dem ersten LIVE.`);
      return OFFLINE_CHECK;
    }
    setState('offline', 'Live-Prüfung fehlgeschlagen: ' + (e?.message || e));
    return OFFLINE_CHECK;
  }

  const client = new TikTokLiveClient(USER).maxRetries(10).staleTimeout(90_000);
  if (PROXY) client.proxy(PROXY);

  client.on(EventType.follow, d => emitFollow(userOf(d), mid(d)));
  client.on(EventType.share, d => emit('share', { _id: mid(d), user: userOf(d) }));
  client.on(EventType.chat, d => emit('chat', { _id: mid(d), user: userOf(d), comment: String(d.content ?? '') }));
  client.on(EventType.like, d => emit('like', { _id: mid(d), user: userOf(d), likeCount: num(d.count) || 1, totalLikeCount: num(d.total) }));
  client.on(EventType.gift, d => {
    const g = d.gift || {};
    emit('gift', {
      _id: mid(d),
      user: userOf(d),
      giftId: num(d.giftId ?? g.id),
      giftName: String(g.name || ('Gift #' + (d.giftId ?? g.id))),
      diamondCount: num(g.diamondCount) || 0,
      repeatCount: Math.max(1, num(d.repeatCount) || 1),
      repeatEnd: isComboGift(d) ? isStreakOver(d) : true,
      giftType: num(g.type) ?? 0,
      groupId: d.groupId != null ? String(d.groupId) : undefined
    });
  });
  client.on(EventType.join, d => emit('join', { _id: mid(d), user: userOf(d) }));
  client.on(EventType.roomUserSeq, d => emit('viewers', { viewerCount: num(d.viewerCount), totalUser: num(d.totalUser) }));
  client.on(EventType.reconnecting, () => setState('reconnecting', 'Verbindung kurz weg – Bibliothek verbindet neu'));
  client.on(EventType.connected, () => { if (ctx.S.state === 'reconnecting') setState('connected', null); });
  client.on('error', e => { ctx.S.lastError = String(e?.message || e); });

  setState('connecting');
  let roomId;
  try { roomId = await client.connect(); }
  catch (e) {
    try { client.disconnect(); } catch {}
    if (e instanceof HostNotOnlineError) { setState('offline', null); return OFFLINE_CHECK; }
    setState('error', 'Verbinden fehlgeschlagen: ' + (e?.message || e));
    return 30_000;
  }
  onConnected(String(roomId), null);

  const reason = await new Promise(resolve => {
    client.on(EventType.liveEnded, () => resolve('streamEnd'));
    client.on(EventType.disconnected, () => resolve('disconnected'));
    const iv = setInterval(() => { if (isStopping()) { clearInterval(iv); resolve('stop'); } }, 1000);
  });
  try { client.disconnect(); } catch {}
  return ctx.onDisconnected(reason);
}
