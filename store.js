/**
 * next-best-job — Encrypted Storage
 *
 * Wraps localStorage with XOR + base64 encoding.
 * Not cryptographically bulletproof, but keeps your data
 * from being readable in DevTools at a glance.
 *
 * Your pipeline data never leaves the browser.
 * The only network requests this app makes are to:
 *   - Anthropic API (when you provide your own API key)
 *   - Indeed / Dice (job search)
 *   - Google Fonts (typography)
 */

const Store = (() => {
  const PREFIX = "nbj_";

  function encode(str, key) {
    // XOR each char with cycling key, then base64
    let out = "";
    for (let i = 0; i < str.length; i++) {
      out += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(out);
  }

  function decode(encoded, key) {
    try {
      const str = atob(encoded);
      let out = "";
      for (let i = 0; i < str.length; i++) {
        out += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return out;
    } catch {
      return null;
    }
  }

  function getKey() {
    // Uses the stored session token as the XOR key.
    // Falls back to a device fingerprint if not set.
    return sessionStorage.getItem("nbj_session") || navigator.userAgent.slice(0, 32);
  }

  return {
    set(name, value) {
      const json = JSON.stringify(value);
      const encoded = encode(json, getKey());
      localStorage.setItem(PREFIX + name, encoded);
    },

    get(name, fallback = null) {
      const encoded = localStorage.getItem(PREFIX + name);
      if (!encoded) return fallback;
      const json = decode(encoded, getKey());
      if (!json) return fallback;
      try { return JSON.parse(json); }
      catch { return fallback; }
    },

    delete(name) {
      localStorage.removeItem(PREFIX + name);
    },

    clear() {
      Object.keys(localStorage)
        .filter(k => k.startsWith(PREFIX))
        .forEach(k => localStorage.removeItem(k));
    },

    setSession(token) {
      sessionStorage.setItem("nbj_session", token);
    },

    clearSession() {
      sessionStorage.removeItem("nbj_session");
    },
  };
})();

if (typeof module !== 'undefined') module.exports = Store;
