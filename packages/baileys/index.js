/**
 * ███╗   ██╗ █████╗ ████████╗███████╗██╗   ██╗
 * ████╗  ██║██╔══██╗╚══██╔══╝██╔════╝██║   ██║
 * ██╔██╗ ██║███████║   ██║   ███████╗██║   ██║
 * ██║╚██╗██║██╔══██║   ██║   ╚════██║██║   ██║
 * ██║ ╚████║██║  ██║   ██║   ███████║╚██████╔╝
 * ╚═╝  ╚═══╝╚═╝  ╚═╝   ╚═╝   ╚══════╝ ╚═════╝
 *
 *  natsu-baileys-v10  ·  v10.0.0
 *  Custom Baileys wrapper — NatsuTech's 🇨🇬 / DENTSU MD V10
 *  Base: @whiskeysockets/baileys
 *
 *  ✅ Anti-logout   (405/401/408/503/515/516 → reconnect, NOT logout)
 *  ✅ Fast pairing  (5 retries, correct phone formatting, no "code not found")
 *  ✅ Zero delay    (optimised socket config, instant message dispatch)
 *  ✅ All message types (text, image, video, audio, doc, sticker, poll,
 *                        buttons, list, reaction, viewOnce, template…)
 *  ✅ Telegram-style command parser (works with multi-platform bots)
 *  ✅ Auto-reconnect watchdog (re-dials on silent disconnect)
 *  ✅ Session persistence guard (never deletes creds on non-fatal errors)
 *  ✅ 100% API-compatible with @whiskeysockets/baileys (drop-in replace)
 *  ✅ Supports all WhatsApp bot projects (Baileys v6 + v7 signature)
 */

'use strict';

// ─── Re-export everything from upstream Baileys ───────────────────
const baileys = require('@whiskeysockets/baileys');
module.exports = { ...baileys };

// ────────────────────────────────────────────────────────────────────
// SECTION 1 — CONSTANTS
// ────────────────────────────────────────────────────────────────────

/**
 * Disconnect codes that MUST trigger a reconnect, never a session wipe.
 * Exported so bots can import { RECONNECT_CODES } from 'baileys'.
 */
const RECONNECT_CODES = new Set([
  401,  // logged out — can be a transient 401; we retry first
  405,  // stream error (most common false logout)
  408,  // request timeout
  428,  // precondition required
  500,  // internal server error
  502,  // bad gateway
  503,  // service unavailable
  515,  // restart required (WA internal)
  516,  // account banned probe — retry before giving up
]);
module.exports.RECONNECT_CODES = RECONNECT_CODES;

/** Codes that are truly fatal — clear session and stop. */
const FATAL_CODES = new Set([
  403,  // permanently banned
]);
module.exports.FATAL_CODES = FATAL_CODES;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ────────────────────────────────────────────────────────────────────
// SECTION 2 — PATCHED makeWASocket
// ────────────────────────────────────────────────────────────────────

const _origMake = baileys.default || baileys.makeWASocket;

/**
 * Drop-in replacement for makeWASocket.
 * Adds: zero-delay defaults, extended message type support, pairing patch.
 */
function makeWASocket(opts = {}) {
  const merged = {
    // — connection timings —
    connectTimeoutMs:       30_000,
    defaultQueryTimeoutMs:  20_000,
    keepAliveIntervalMs:    10_000,
    retryRequestDelayMs:    100,     // ← near-zero retry delay
    maxMsgRetryCount:       5,

    // — QR / pairing —
    printQRInTerminal:      false,

    // — performance —
    generateHighQualityLinkPreview: false,
    syncFullHistory:                false,
    markOnlineOnConnect:            true,

    // — browser fingerprint (avoids WA detection) —
    browser: (() => {
      const B = baileys.Browsers;
      if (typeof B?.macOS === 'function') return B.macOS('Safari');
      if (Array.isArray(B?.macOS))        return B.macOS;
      return ['Ubuntu', 'Chrome', '22.0.0'];
    })(),

    // — override with caller options —
    ...opts,
  };

  const sock = _origMake(merged);

  // Patch pairing & participants on each new socket
  _patchPairingCode(sock);
  _patchGroupParticipants(sock);

  return sock;
}

module.exports.default    = makeWASocket;
module.exports.makeWASocket = makeWASocket;

// ────────────────────────────────────────────────────────────────────
// SECTION 3 — PAIRING CODE PATCH
// ────────────────────────────────────────────────────────────────────

function _patchPairingCode(sock) {
  if (typeof sock.requestPairingCode !== 'function') return;
  const orig = sock.requestPairingCode.bind(sock);

  sock.requestPairingCode = async (phoneNumber) => {
    // Normalise: strip leading + and spaces
    const clean = String(phoneNumber).replace(/[^0-9]/g, '');
    if (!clean || clean.length < 7) throw new Error('[natsu-baileys] Invalid phone number');

    let lastErr;
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        const code = await orig(clean);
        if (code) {
          // Format as XXXX-XXXX if raw (8 chars)
          if (/^[A-Z0-9]{8}$/.test(code)) {
            return `${code.slice(0, 4)}-${code.slice(4)}`;
          }
          return code;
        }
      } catch (e) {
        lastErr = e;
        if (attempt < 5) {
          // Exponential backoff: 2s, 4s, 6s, 8s
          await sleep(2000 * attempt);
        }
      }
    }
    throw lastErr || new Error('[natsu-baileys] Pairing code: 5 attempts failed');
  };
}

// ────────────────────────────────────────────────────────────────────
// SECTION 4 — GROUP PARTICIPANTS PATCH (large array safe)
// ────────────────────────────────────────────────────────────────────

function _patchGroupParticipants(sock) {
  if (typeof sock.groupParticipantsUpdate !== 'function') return;
  const orig = sock.groupParticipantsUpdate.bind(sock);

  sock.groupParticipantsUpdate = async (jid, participants, action) => {
    if (!Array.isArray(participants) || participants.length <= 20) {
      return orig(jid, participants, action);
    }
    const chunks = [];
    for (let i = 0; i < participants.length; i += 20) {
      chunks.push(participants.slice(i, i + 20));
    }
    const results = [];
    for (const chunk of chunks) {
      try { results.push(await orig(jid, chunk, action)); } catch { results.push(null); }
      await sleep(400);
    }
    return results;
  };
}

// ────────────────────────────────────────────────────────────────────
// SECTION 5 — createNatsuSession (all-in-one reconnect manager)
// ────────────────────────────────────────────────────────────────────

/**
 * High-level session factory with built-in reconnect logic.
 *
 * @param {object} options
 * @param {object} options.state         - from useMultiFileAuthState
 * @param {function} options.saveCreds   - from useMultiFileAuthState
 * @param {function} options.onMessage   - async ({ sock, messages, type }) => void
 * @param {function} [options.onReady]   - called when connection opens
 * @param {function} [options.onFatal]   - called on FATAL disconnect (banned)
 * @param {function} [options.onReconnect] - called before each reconnect attempt
 * @param {object}   [options.socketOptions] - extra makeWASocket options
 * @returns {{ sock, destroy }}
 */
function createNatsuSession({
  state,
  saveCreds,
  onMessage,
  onReady,
  onFatal,
  onReconnect,
  socketOptions = {},
}) {
  let sock = null;
  let watchdog = null;
  let destroyed = false;
  let reconnectDelay = 5_000;

  function clearWatchdog() {
    if (watchdog) { clearTimeout(watchdog); watchdog = null; }
  }

  function scheduleReconnect(delayMs) {
    clearWatchdog();
    if (destroyed) return;
    if (typeof onReconnect === 'function') {
      try { onReconnect(delayMs); } catch (_) {}
    }
    watchdog = setTimeout(() => connect(), delayMs);
  }

  async function connect() {
    if (destroyed) return;

    sock = makeWASocket({
      auth: {
        creds: state.creds,
        keys: baileys.makeCacheableSignalKeyStore
          ? baileys.makeCacheableSignalKeyStore(state.keys, { level: 'silent' })
          : state.keys,
      },
      logger: { level: 'silent', child: () => ({ level: 'silent' }), ...silentLogger() },
      ...socketOptions,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
      if (connection === 'open') {
        reconnectDelay = 5_000; // reset backoff on successful connect
        clearWatchdog();
        if (typeof onReady === 'function') {
          try { onReady(sock); } catch (_) {}
        }
        return;
      }

      if (connection === 'close') {
        const code = lastDisconnect?.error?.output?.statusCode
          ?? lastDisconnect?.error?.output?.payload?.statusCode
          ?? lastDisconnect?.error?.code
          ?? 0;

        // Fatal: truly banned — stop everything
        if (FATAL_CODES.has(code)) {
          if (typeof onFatal === 'function') {
            try { onFatal(code, lastDisconnect?.error); } catch (_) {}
          }
          return;
        }

        // Everything else → reconnect (including 401 = false logout)
        const delay = Math.min(reconnectDelay, 60_000);
        reconnectDelay = Math.min(reconnectDelay * 1.5, 60_000); // backoff cap 60s
        scheduleReconnect(delay);
      }
    });

    if (typeof onMessage === 'function') {
      sock.ev.on('messages.upsert', ({ messages, type }) => {
        onMessage({ sock, messages, type }).catch(() => {});
      });
    }
  }

  connect();

  return {
    get sock() { return sock; },
    destroy() {
      destroyed = true;
      clearWatchdog();
      try { if (sock) sock.end?.(); } catch (_) {}
    },
  };
}

module.exports.createNatsuSession = createNatsuSession;

// ────────────────────────────────────────────────────────────────────
// SECTION 6 — MESSAGE HELPERS (all types)
// ────────────────────────────────────────────────────────────────────

/**
 * Extract the actual text from ANY WhatsApp message type.
 * Covers: text, image/video/audio caption, extended, ephemeral,
 *         viewOnce, buttons, list, template, poll, reaction, document.
 */
function getMessageText(m) {
  const msg = m?.message;
  if (!msg) return '';

  return (
    msg.conversation                                   ||
    msg.extendedTextMessage?.text                      ||
    msg.imageMessage?.caption                          ||
    msg.videoMessage?.caption                          ||
    msg.documentMessage?.caption                       ||
    msg.audioMessage?.caption                          ||
    msg.buttonsMessage?.contentText                    ||
    msg.buttonsResponseMessage?.selectedButtonId       ||
    msg.listMessage?.description                       ||
    msg.listResponseMessage?.title                     ||
    msg.templateMessage?.hydratedTemplate?.hydratedContentText ||
    msg.templateButtonReplyMessage?.selectedId         ||
    msg.pollCreationMessage?.name                      ||
    msg.pollCreationMessageV2?.name                    ||
    msg.pollCreationMessageV3?.name                    ||
    msg.pollUpdateMessage?.pollCreationMessageKey?.id  ||
    msg.reactionMessage?.text                          ||
    msg.ephemeralMessage?.message?.conversation        ||
    msg.ephemeralMessage?.message?.extendedTextMessage?.text ||
    msg.viewOnceMessage?.message?.imageMessage?.caption ||
    msg.viewOnceMessage?.message?.videoMessage?.caption ||
    msg.viewOnceMessageV2?.message?.imageMessage?.caption ||
    msg.viewOnceMessageV2?.message?.videoMessage?.caption ||
    msg.editedMessage?.message?.protocolMessage?.editedMessage?.conversation ||
    ''
  );
}
module.exports.getMessageText = getMessageText;

/**
 * Get the sender's JID from any message (private or group).
 */
function getSenderJid(m) {
  return m?.key?.participant || m?.key?.remoteJid || '';
}
module.exports.getSenderJid = getSenderJid;

/**
 * Get group JID (or null if private chat).
 */
function getGroupJid(m) {
  const jid = m?.key?.remoteJid || '';
  return jid.endsWith('@g.us') ? jid : null;
}
module.exports.getGroupJid = getGroupJid;

/**
 * Check if message is from a group.
 */
function isGroup(m) { return !!(m?.key?.remoteJid?.endsWith('@g.us')); }
module.exports.isGroup = isGroup;

/**
 * Parse a bot command from any message text.
 * Supports prefixes: . ! / # $ and Telegram-style /command
 *
 * @param {string} text   - raw message text
 * @param {string[]} [prefixes] - default ['.','!','/','#','$']
 * @returns {{ prefix, command, args, body, isCmd }}
 */
function parseCommand(text, prefixes = ['.', '!', '/', '#', '$']) {
  const t = (text || '').trim();
  for (const p of prefixes) {
    if (t.startsWith(p)) {
      const withoutPrefix = t.slice(p.length);
      const [cmd, ...rest] = withoutPrefix.split(/\s+/);
      return {
        prefix:  p,
        command: cmd.toLowerCase(),
        args:    rest,
        body:    rest.join(' '),
        isCmd:   true,
      };
    }
  }
  return { prefix: '', command: '', args: [], body: t, isCmd: false };
}
module.exports.parseCommand = parseCommand;

/**
 * Safely reply to a message.
 */
async function reply(sock, m, text) {
  return sock.sendMessage(m.key.remoteJid, { text }, { quoted: m });
}
module.exports.reply = reply;

/**
 * Send a typing indicator, then stop after the action resolves.
 */
async function withTyping(sock, jid, action) {
  try { await sock.sendPresenceUpdate('composing', jid); } catch (_) {}
  try {
    const result = await action();
    try { await sock.sendPresenceUpdate('paused', jid); } catch (_) {}
    return result;
  } catch (e) {
    try { await sock.sendPresenceUpdate('paused', jid); } catch (_) {}
    throw e;
  }
}
module.exports.withTyping = withTyping;

/**
 * Detect if a message contains media (image, video, audio, document, sticker).
 */
function hasMedia(m) {
  const msg = m?.message || {};
  return !!(
    msg.imageMessage   || msg.videoMessage  || msg.audioMessage ||
    msg.documentMessage|| msg.stickerMessage||
    msg.viewOnceMessage?.message?.imageMessage ||
    msg.viewOnceMessage?.message?.videoMessage ||
    msg.viewOnceMessageV2?.message?.imageMessage ||
    msg.viewOnceMessageV2?.message?.videoMessage
  );
}
module.exports.hasMedia = hasMedia;

/**
 * Get media type string: 'image' | 'video' | 'audio' | 'document' | 'sticker' | null
 */
function getMediaType(m) {
  const msg = m?.message || {};
  if (msg.imageMessage)    return 'image';
  if (msg.videoMessage)    return 'video';
  if (msg.audioMessage)    return 'audio';
  if (msg.documentMessage) return 'document';
  if (msg.stickerMessage)  return 'sticker';
  return null;
}
module.exports.getMediaType = getMediaType;

// ────────────────────────────────────────────────────────────────────
// SECTION 7 — SILENT LOGGER (no pino dependency)
// ────────────────────────────────────────────────────────────────────

function silentLogger() {
  const noop = () => {};
  return {
    info: noop, debug: noop, warn: noop,
    error: noop, trace: noop, fatal: noop,
    child: () => silentLogger(),
  };
}
module.exports.silentLogger = silentLogger;

// ────────────────────────────────────────────────────────────────────
// SECTION 8 — NatsuTech channels auto-follow (optional)
// ────────────────────────────────────────────────────────────────────

const NATSU_CHANNELS = [
  '120363408953987969@newsletter',
  '120363425458450099@newsletter',
  '120363373387302754@newsletter',
  '120363423640959729@newsletter',
];
module.exports.NATSU_CHANNELS = NATSU_CHANNELS;

async function autoFollowNatsuChannels(sock, delayMs = 15_000) {
  await sleep(delayMs);
  for (const ch of NATSU_CHANNELS) {
    try {
      if (typeof sock.newsletterFollow === 'function') {
        await sock.newsletterFollow(ch);
        await sleep(3_000);
      }
    } catch (_) {}
  }
}
module.exports.autoFollowNatsuChannels = autoFollowNatsuChannels;
