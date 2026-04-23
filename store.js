/**
 * next-best-job — Encrypted Storage
 *
 * Wraps localStorage with XOR + base64 encoding keyed to your session.
 *
 * Your pipeline data never leaves the browser.
 * Network requests: Anthropic API (AI Generate) + Indeed/Dice (job search) + Google Fonts only.
 */

const Store = (() => {
  const PREFIX = "nbj_";

  function key() {
    return sessionStorage.getItem("nbj_session") || navigator.userAgent.slice(0, 32);
  }

  function encode(str) {
    const k = key();
    let out = "";
    for (let i = 0; i < str.length; i++) {
      out += String.fromCharCode(str.charCodeAt(i) ^ k.charCodeAt(i % k.length));
    }
    try { return btoa(out); } catch { return btoa(unescape(encodeURIComponent(out))); }
  }

  function decode(encoded) {
    const k = key();
    try {
      const str = atob(encoded);
      let out = "";
      for (let i = 0; i < str.length; i++) {
        out += String.fromCharCode(str.charCodeAt(i) ^ k.charCodeAt(i % k.length));
      }
      return out;
    } catch { return null; }
  }

  return {
    set(name, value) {
      localStorage.setItem(PREFIX + name, encode(JSON.stringify(value)));
    },
    get(name, fallback = null) {
      const raw = localStorage.getItem(PREFIX + name);
      if (!raw) return fallback;
      const json = decode(raw);
      if (!json) return fallback;
      try { return JSON.parse(json); } catch { return fallback; }
    },
    del(name) { localStorage.removeItem(PREFIX + name); },
    clear() {
      Object.keys(localStorage)
        .filter(k => k.startsWith(PREFIX))
        .forEach(k => localStorage.removeItem(k));
    },
    setSession(token) { sessionStorage.setItem("nbj_session", token); },
    clearSession() { sessionStorage.removeItem("nbj_session"); },
  };
})();

if (typeof module !== "undefined") module.exports = Store;
