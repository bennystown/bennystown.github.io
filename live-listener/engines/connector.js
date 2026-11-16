// Engine „connector“ (Reserve): TikTok-Live-Connector (zerodytrash), die bekannteste Bibliothek.
// Braucht für den WebSocket-Aufbau den Signatur-Dienst von Euler Stream (eulerstream.com).
// Anonym nutzbar; ein kostenloser EULER_API_KEY in .env hebt die Limits an.
// Es wird KEINE TikTok-Session übergeben (kein Login, keine Cookies, authenticateWs aus).
import { TikTokLiveConnection, WebcastEvent, ControlEvent, UserOfflineError, SignatureRateLimitError, IsLiveRouteConfig } from 'tiktok-live-connector';
import { HttpsProxyAgent } from 'https-proxy-agent';

export const name = 'tiktok-live-connector (über Euler-Stream-Signatur)';

// Die Offline-Prüfung fragt nur TikTok selbst, nicht Euler -> Warten kostet kein Kontingent.
IsLiveRouteConfig.skipFetchRoomIdFromEulerRoute = true;
let unclearChecks = 0;

export async function session(ctx) {
  const { USER, PROXY, OFFLINE_CHECK, EULER_API_KEY, setState, emit, emitFollow, onConnected, isStopping, userOf, num } = ctx;
  const agent = PROXY ? new HttpsProxyAgent(PROXY) : undefined;
  const make = () => new TikTokLiveConnection(USER, {
    authenticateWs: false,
    useMobile: false,
    processInitialData: false,      // keine alten Chat-Nachrichten nachspielen
    enableExtendedGiftInfo: false,  // Geschenkliste bräuchte eine signierte Anfrage (nur Euler-Bezahltarif)
    signApiKey: EULER_API_KEY,
    ...(agent ? { webClientOptions: { agent: { https: agent, http: agent } }, wsClientOptions: { agent } } : {})
  });

  setState('checking');
  let live;
  try { live = await make().fetchIsLive(); unclearChecks = 0; }
  catch (e) {
    unclearChecks++;
    const why = (e?.config?.requestErrs || []).map(x => x?.message).filter(Boolean).join(' / ') || e?.message || String(e);
    if (unclearChecks % 10 !== 0) { setState('offline', 'Kein LIVE gefunden (' + why.slice(0, 160) + ')'); return OFFLINE_CHECK; }
    live = true; // alle ~10 Prüfungen trotzdem echten Verbindungsversuch machen
  }
  if (!live) { setState('offline', null); return OFFLINE_CHECK; }

  const conn = make();
  let lastData = Date.now();
  conn.on(ControlEvent.DECODED_DATA, () => { lastData = Date.now(); });
  conn.on(ControlEvent.ERROR, e => { ctx.S.lastError = String(e?.exception?.message || e?.info || e?.message || e); });
  conn.on(WebcastEvent.FOLLOW, d => emitFollow(userOf(d)));
  conn.on(WebcastEvent.SHARE, d => emit('share', { user: userOf(d) }));
  conn.on(WebcastEvent.CHAT, d => emit('chat', { user: userOf(d), comment: d.comment || '' }));
  conn.on(WebcastEvent.LIKE, d => emit('like', { user: userOf(d), likeCount: num(d.likeCount) || 1, totalLikeCount: num(d.totalLikeCount) }));
  conn.on(WebcastEvent.GIFT, d => {
    const g = d.giftDetails || {};
    const giftType = num(g.giftType) ?? 0;
    emit('gift', {
      user: userOf(d),
      giftId: num(d.giftId),
      giftName: g.giftName || ('Gift #' + d.giftId),
      diamondCount: num(g.diamondCount) || 0,
      repeatCount: Math.max(1, num(d.repeatCount) || 1),
      repeatEnd: giftType === 1 ? !!d.repeatEnd : true,
      giftType,
      groupId: d.groupId != null ? String(d.groupId) : undefined
    });
  });
  conn.on(WebcastEvent.MEMBER, d => emit('join', { user: userOf(d) }));
  conn.on(WebcastEvent.ROOM_USER, d => emit('viewers', { viewerCount: num(d.viewerCount ?? d.total) }));

  setState('connecting');
  let st;
  try { st = await conn.connect(); }
  catch (e) {
    try { await conn.disconnect(); } catch {}
    if (e instanceof UserOfflineError) { setState('offline', null); return OFFLINE_CHECK; }
    if (e instanceof SignatureRateLimitError || /rate.?limit|429/i.test(e?.message || '')) {
      setState('error', 'Euler-Signatur: Rate-Limit erreicht. Warte 5 Min. (Abhilfe: kostenloser EULER_API_KEY in .env)');
      return 5 * 60_000;
    }
    setState('error', 'Verbinden fehlgeschlagen: ' + (e?.message || e));
    return 30_000;
  }
  onConnected(String(st.roomId), st.roomInfo?.data?.title || null);

  const reason = await new Promise(resolve => {
    conn.once(ControlEvent.DISCONNECTED, () => resolve('disconnected'));
    conn.once(WebcastEvent.STREAM_END, () => resolve('streamEnd'));
    const iv = setInterval(async () => {
      if (isStopping()) { clearInterval(iv); return resolve('stop'); }
      if (Date.now() - lastData > 120_000) { // 2 Min. Funkstille -> prüfen
        clearInterval(iv);
        let stillLive = true; try { stillLive = await make().fetchIsLive(); } catch {}
        resolve(stillLive ? 'silence' : 'streamEnd');
      }
    }, 10_000);
    conn.once(ControlEvent.DISCONNECTED, () => clearInterval(iv));
  });
  try { await conn.disconnect(); } catch {}
  return ctx.onDisconnected(reason);
}
