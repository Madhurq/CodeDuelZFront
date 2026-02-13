import { auth } from '../config/firebase';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

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
 */
export async function getLeaderboard() {
    const response = await fetch(`${BASE_URL}/leaderboard`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return response.json();
}

/**
 * Get a user's public profile by ID - no authentication required
 */
export async function getPublicProfile(userId) {
    const response = await fetch(`${BASE_URL}/profile/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return response.json();
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
 * Returns: { leetCode: {...}, codeforces: {...}, codeChef: {...} }
 */
export async function getExternalStats() {
    return apiGet('/external-stats');
}
