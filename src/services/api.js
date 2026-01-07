import { auth } from '../config/firebase';

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

    return fetch(url, {
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
