export const CONFIG = {
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL || "https://indy-locator-exchange.onrender.com",
    ETIMS_ENDPOINT: "https://prodpci.etimspayments.com/pbw/inputAction.doh",
    SNAPSHOT_PROXY_URL: "https://indy-locator-exchange.onrender.com/api/proxy/lpr", 
    STORAGE_KEYS: {
        STREETS: "opencurb_streets_data",
        META: "opencurb_meta_check",
        FAVORITES: "opencurb_favorites",
        RECENT: "opencurb_recent_searches",
    },
    MAX_RECENT: 10,
    MAX_FAVORITES: 20,
    REQUEST_TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
};

export const US_STATES = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", 
    "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", 
    "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", 
    "VT", "VA", "WA", "WV", "WI", "WY"
];

export function luhnValidate(fullcode) {
    let len = fullcode.length;
    let parity = len % 2;
    let sum = 0;
    for (let i = len-1; i >= 0; i--) {
        let d = parseInt(fullcode.charAt(i));
        if (i % 2 === parity) { d *= 2; }
        if (d > 9) { d -= 9; }
        sum += d;
    }
    return sum % 10 === 0;
}

export function vibrate(pattern = 10) {
    if ('vibrate' in navigator) navigator.vibrate(pattern);
}

export async function fetchWithRetry(url, options = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 30000);
            const res = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(id);
            return res;
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        }
    }
}

export const storage = {
    get: (key, def = null) => {
        try { return JSON.parse(localStorage.getItem(key)) || def; } catch { return def; }
    },
    set: (key, val) => {
        try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
    },
    remove: (key) => localStorage.removeItem(key)
};
