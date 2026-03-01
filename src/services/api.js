import { auth } from '../config/firebase';
import { cacheGet, cacheSet, cacheInvalidate, cacheInvalidatePrefix } from './cache';

const LOCAL_URL = 'http://localhost:8080';
const REMOTE_URL = import.meta.env.VITE_API_BASE_URL || 'https://codeduelz-kscu.onrender.com';

// Resolved at runtime: try local first, fallback to remote
let resolvedBaseUrl = null;

async function resolveBaseUrl() {
    if (resolvedBaseUrl !== null) return resolvedBaseUrl;
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1500);
        await fetch(`${LOCAL_URL}/leaderboard`, { signal: controller.signal });
        clearTimeout(timeout);
        resolvedBaseUrl = LOCAL_URL;
        console.log('API: Connected to local server at', LOCAL_URL);
    } catch {
        resolvedBaseUrl = REMOTE_URL;
        console.log('API: Local server unavailable, using remote:', REMOTE_URL);
    }
    return resolvedBaseUrl;
}

// Kick off detection immediately on import
const baseUrlPromise = resolveBaseUrl();

export async function getBaseUrl() {
    return baseUrlPromise;
}

// Synchronous getter (returns REMOTE_URL until resolved)
export function getResolvedBaseUrl() {
    return resolvedBaseUrl ?? REMOTE_URL;
}

/**
 * Makes an authenticated API request with Firebase ID token.
 * @param {string} url - The API endpoint (e.g., '/api/profile')
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {Promise<Response>} - The fetch response
 */
export async function authenticatedFetch(url, options = {}) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error('User not authenticated');
    }

    const token = await user.getIdToken();

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    };

    const BASE_URL = await getBaseUrl();
    return fetch(`${BASE_URL}${url}`, {
        ...options,
        headers,
    });
}

/**
 * GET request with authentication
 */
export async function apiGet(url) {
    const response = await authenticatedFetch(url, { method: 'GET' });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return response.json();
}

/**
 * POST request with authentication
 */
export async function apiPost(url, data) {
    const response = await authenticatedFetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return response.json();
}

/**
 * PUT request with authentication
 */
export async function apiPut(url, data) {
    const response = await authenticatedFetch(url, {
        method: 'PUT',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return response.json();
}

/**
 * Get the leaderboard (top 10 players) - no authentication required
 * Cached for 2 minutes in the browser.
 */
export async function getLeaderboard(bypassCache = false) {
    const CACHE_KEY = 'leaderboard';
    if (!bypassCache) {
        const cached = cacheGet(CACHE_KEY);
        if (cached) return cached;
    }

    const BASE_URL = await getBaseUrl();
    const response = await fetch(`${BASE_URL}/leaderboard`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    cacheSet(CACHE_KEY, data, 2 * 60 * 1000); // 2 min
    return data;
}

/**
 * Get a user's public profile by ID - no authentication required
 * Cached for 2 minutes per userId in the browser.
 */
export async function getPublicProfile(userId) {
    const CACHE_KEY = `publicProfile:${userId}`;
    const cached = cacheGet(CACHE_KEY);
    if (cached) return cached;

    const BASE_URL = await getBaseUrl();
    const response = await fetch(`${BASE_URL}/profile/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    cacheSet(CACHE_KEY, data, 2 * 60 * 1000); // 2 min
    return data;
}

/**
 * Get user's match history (authenticated)
 * Returns: Array of { matchId, opponentId, opponentName, problemId, problemTitle, status, result, startTime, endTime }
 */
export async function getMatchHistory() {
    return apiGet('/matches/history');
}

/**
 * Create a new match (authenticated)
 * @param {object} data - { opponentUserId: number, difficulty: 'EASY' | 'MEDIUM' | 'HARD' }
 * Returns: { matchId, player1Id, player1Name, player2Id, player2Name, problemId, problemTitle, startTime, endTime, status }
 */
export async function createMatch(data) {
    return apiPost('/matches', data);
}

/**
 * Submit match result
 * @param {number} matchId - The match ID
 * @param {object} data - { winnerUserId: number }
 */
export async function submitMatchResult(matchId, data) {
    const response = await authenticatedFetch(`/matches/${matchId}/result`, {
        method: 'POST',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    // This endpoint returns void, so don't parse JSON
    return true;
}

/**
 * Get problem for a specific match
 * @param {number} matchId - The match ID
 * Returns: { problemId, title, description, difficulty }
 */
export async function getMatchProblem(matchId) {
    return apiGet(`/matches/${matchId}/problem`);
}

/**
 * Get a random problem by difficulty - no authentication required
 * @param {string} difficulty - 'EASY' | 'MEDIUM' | 'HARD'
 */
export async function getRandomProblem(difficulty) {
    const BASE_URL = await getBaseUrl();
    const response = await fetch(`${BASE_URL}/problems/random?difficulty=${difficulty}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return response.json();
}

/**
 * Get external stats from LeetCode, Codeforces, and CodeChef (authenticated)
 * Cached for 5 minutes in the browser.
 * Returns: { leetCode: {...}, codeforces: {...}, codeChef: {...} }
 */
export async function getExternalStats() {
    const CACHE_KEY = 'externalStats';
    const cached = cacheGet(CACHE_KEY);
    if (cached) return cached;

    const data = await apiGet('/external-stats');
    cacheSet(CACHE_KEY, data, 5 * 60 * 1000); // 5 min
    return data;
}

// ============================================
// Friend System API Functions
// ============================================

/**
 * Get all friends with online status (authenticated)
 * Returns: Array of { friendId, userId, username, email, isOnline }
 * Online friends are sorted to the top
 */
export async function getFriends() {
    return apiGet('/api/friends');
}

/**
 * Get pending friend requests (authenticated)
 * Returns: Array of { requestId, fromUserId, fromUsername, toUserId, toUsername, status, createdAt }
 */
export async function getPendingRequests() {
    return apiGet('/api/friends/requests');
}

/**
 * Send a friend request by username (authenticated)
 * @param {string} username - The username to send friend request to
 * Returns: { requestId, fromUserId, fromUsername, toUserId, toUsername, status, createdAt }
 */
export async function sendFriendRequest(username) {
    return apiPost('/api/friends/request', { toUsername: username });
}

/**
 * Accept a friend request (authenticated)
 * @param {number} requestId - The friend request ID
 * Returns: void
 */
export async function acceptFriendRequest(requestId) {
    const response = await authenticatedFetch(`/api/friends/accept/${requestId}`, {
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return true;
}

/**
 * Reject a friend request (authenticated)
 * @param {number} requestId - The friend request ID
 * Returns: void
 */
export async function rejectFriendRequest(requestId) {
    const response = await authenticatedFetch(`/api/friends/reject/${requestId}`, {
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return true;
}

/**
 * Remove a friend (authenticated)
 * @param {number} friendId - The friend ID to remove
 * Returns: void
 */
export async function removeFriend(friendId) {
    const response = await authenticatedFetch(`/api/friends/${friendId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return true;
}

// ============================================
// Notification API Functions
// ============================================

export async function getNotifications() {
    return apiGet('/api/notifications');
}

export async function getUnreadCount() {
    return apiGet('/api/notifications/unread-count');
}

export async function markNotificationRead(id) {
    const response = await authenticatedFetch(`/api/notifications/${id}/read`, { method: 'POST' });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return true;
}

export async function markAllNotificationsRead() {
    const response = await authenticatedFetch('/api/notifications/mark-all-read', { method: 'POST' });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return true;
}

export function invalidateLeaderboardCache() {
    cacheInvalidate('leaderboard');
}

export function invalidateProfileCache() {
    cacheInvalidatePrefix('publicProfile');
    cacheInvalidate('externalStats');
}
