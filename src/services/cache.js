/**
 * Lightweight in-memory cache for the browser.
 * Prevents redundant API calls when navigating between pages in the SPA.
 * This is NOT Redis — it's a plain JavaScript Map with TTL expiration.
 */

const cache = new Map();

/**
 * Get a cached value if it exists and hasn't expired.
 * @param {string} key
 * @returns {any|null} cached data or null if miss/expired
 */
export function cacheGet(key) {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        cache.delete(key);
        return null;
    }
    return entry.data;
}

/**
 * Store a value in cache with a TTL.
 * @param {string} key
 * @param {any} data
 * @param {number} ttlMs - Time to live in milliseconds
 */
export function cacheSet(key, data, ttlMs) {
    cache.set(key, {
        data,
        expiresAt: Date.now() + ttlMs,
    });
}

/**
 * Invalidate a specific cache key.
 * @param {string} key
 */
export function cacheInvalidate(key) {
    cache.delete(key);
}

/**
 * Invalidate all cache keys that start with the given prefix.
 * @param {string} prefix
 */
export function cacheInvalidatePrefix(prefix) {
    for (const key of cache.keys()) {
        if (key.startsWith(prefix)) {
            cache.delete(key);
        }
    }
}

/**
 * Clear the entire cache.
 */
export function cacheClear() {
    cache.clear();
}
