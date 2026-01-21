/**
 * Codeforces API Service
 * Fetches problems directly from Codeforces public API
 * No authentication required, rate limit: 5 requests per second
 */

const CODEFORCES_API = 'https://codeforces.com/api';

// Cache problems in memory to avoid repeated API calls
let cachedProblems = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Map Codeforces rating to difficulty levels
 * Rating ranges based on Codeforces problem ratings
 */
const DIFFICULTY_RANGES = {
    easy: { min: 800, max: 1200 },
    medium: { min: 1200, max: 1600 },
    hard: { min: 1600, max: 2200 }
};

/**
 * Fetch all problems from Codeforces
 */
export async function fetchAllProblems() {
    // Return cached if still valid
    if (cachedProblems && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
        return cachedProblems;
    }

    try {
        const response = await fetch(`${CODEFORCES_API}/problemset.problems`);
        const data = await response.json();

        if (data.status !== 'OK') {
            throw new Error(data.comment || 'Failed to fetch problems');
        }

        cachedProblems = data.result.problems;
        cacheTimestamp = Date.now();
        return cachedProblems;
    } catch (error) {
        console.error('Error fetching Codeforces problems:', error);
        throw error;
    }
}

/**
 * Get a random problem by difficulty
 * @param {string} difficulty - 'easy', 'medium', or 'hard'
 * @returns {Promise<Object>} - Problem object
 */
export async function getRandomProblem(difficulty = 'medium') {
    const problems = await fetchAllProblems();
    const range = DIFFICULTY_RANGES[difficulty] || DIFFICULTY_RANGES.medium;

    // Filter problems by rating and ensure they have a rating
    const filteredProblems = problems.filter(p =>
        p.rating >= range.min &&
        p.rating <= range.max
    );

    if (filteredProblems.length === 0) {
        throw new Error(`No problems found for difficulty: ${difficulty}`);
    }

    // Pick a random problem
    const randomIndex = Math.floor(Math.random() * filteredProblems.length);
    const problem = filteredProblems[randomIndex];

    return formatProblem(problem);
}

/**
 * Get a specific problem by contest ID and index
 * @param {number} contestId 
 * @param {string} index - e.g., 'A', 'B', 'C'
 */
export async function getProblem(contestId, index) {
    const problems = await fetchAllProblems();
    const problem = problems.find(p =>
        p.contestId === contestId && p.index === index
    );

    if (!problem) {
        throw new Error(`Problem ${contestId}${index} not found`);
    }

    return formatProblem(problem);
}

/**
 * Format Codeforces problem to match our app's structure
 */
function formatProblem(cfProblem) {
    return {
        id: `${cfProblem.contestId}${cfProblem.index}`,
        contestId: cfProblem.contestId,
        index: cfProblem.index,
        title: cfProblem.name,
        difficulty: getDifficultyLabel(cfProblem.rating),
        rating: cfProblem.rating,
        tags: cfProblem.tags || [],
        url: `https://codeforces.com/problemset/problem/${cfProblem.contestId}/${cfProblem.index}`,
        description: null, // Will be fetched separately
        examples: [],
        constraints: [],
        source: 'codeforces'
    };
}

/**
 * Fetch the actual problem statement from Codeforces page
 * Uses a CORS proxy to bypass browser restrictions
 */
export async function getProblemStatement(contestId, index) {
    const problemUrl = `https://codeforces.com/problemset/problem/${contestId}/${index}`;
    // User requested the version that worked when dev tools were open (no timestamp)
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(problemUrl)}`;

    try {
        console.log('Fetching problem from:', proxyUrl);
        const response = await fetch(proxyUrl);
        const data = await response.json();

        if (!data.contents) {
            console.error('No contents in response:', data);
            throw new Error('Empty response from proxy');
        }

        console.log('Got HTML, parsing...');
        return parseCodeforcesHtml(data.contents);

    } catch (error) {
        console.error('Error fetching problem statement:', error);
        return {
            description: 'Failed to load problem statement. Please view on Codeforces.',
            examples: [],
            constraints: []
        };
    }
}

/**
 * Parse Codeforces HTML to extract problem statement
 */
function parseCodeforcesHtml(html) {
    try {
        // Parse the HTML to extract problem statement
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Extract problem statement
        const statementDiv = doc.querySelector('.problem-statement');
        if (!statementDiv) {
            return { description: 'Problem statement could not be loaded.', examples: [], constraints: [] };
        }

        // Get the main problem description (skip the title div)
        const descriptionParts = [];
        const divs = statementDiv.querySelectorAll(':scope > div');

        divs.forEach(div => {
            if (div.classList.contains('header')) return;
            if (div.classList.contains('input-specification')) {
                descriptionParts.push('\n**Input:**\n' + div.textContent.replace('Input', '').trim());
            } else if (div.classList.contains('output-specification')) {
                descriptionParts.push('\n**Output:**\n' + div.textContent.replace('Output', '').trim());
            } else if (div.classList.contains('sample-tests')) {
                // Skip
            } else if (div.classList.contains('note')) {
                descriptionParts.push('\n**Note:**\n' + div.textContent.replace('Note', '').trim());
            } else if (!div.classList.contains('input') && !div.classList.contains('output')) {
                descriptionParts.push(div.textContent.trim());
            }
        });

        // Extract examples
        const examples = [];
        const sampleTests = statementDiv.querySelector('.sample-tests');
        if (sampleTests) {
            const inputs = sampleTests.querySelectorAll('.input pre');
            const outputs = sampleTests.querySelectorAll('.output pre');

            for (let i = 0; i < Math.min(inputs.length, outputs.length); i++) {
                examples.push({
                    input: inputs[i].textContent.trim(),
                    output: outputs[i].textContent.trim()
                });
            }
        }

        // Extract time/memory limits from header
        const constraints = [];
        const header = statementDiv.querySelector('.header');
        if (header) {
            const timeLimit = header.querySelector('.time-limit');
            const memoryLimit = header.querySelector('.memory-limit');
            if (timeLimit) constraints.push(timeLimit.textContent.trim());
            if (memoryLimit) constraints.push(memoryLimit.textContent.trim());
        }

        return {
            description: descriptionParts.join('\n\n'),
            examples,
            constraints
        };
    } catch (error) {
        console.error('Error parsing problem HTML:', error);
        return {
            description: 'Failed to parse problem statement.',
            examples: [],
            constraints: []
        };
    }
}

/**
 * Get a random problem with full statement
 */
export async function getRandomProblemWithStatement(difficulty = 'medium') {
    const problem = await getRandomProblem(difficulty);
    const statement = await getProblemStatement(problem.contestId, problem.index);

    return {
        ...problem,
        ...statement
    };
}

/**
 * Convert rating to difficulty label
 */
function getDifficultyLabel(rating) {
    if (!rating) return 'Unknown';
    if (rating <= 1200) return 'Easy';
    if (rating <= 1600) return 'Medium';
    if (rating <= 2200) return 'Hard';
    return 'Expert';
}

/**
 * Get problems by tag
 * @param {string} tag - e.g., 'dp', 'graphs', 'greedy'
 * @param {string} difficulty - optional difficulty filter
 */
export async function getProblemsByTag(tag, difficulty = null) {
    const problems = await fetchAllProblems();

    let filtered = problems.filter(p =>
        p.tags && p.tags.includes(tag)
    );

    if (difficulty) {
        const range = DIFFICULTY_RANGES[difficulty];
        if (range) {
            filtered = filtered.filter(p =>
                p.rating >= range.min && p.rating <= range.max
            );
        }
    }

    return filtered.map(formatProblem);
}

/**
 * Get all available tags
 */
export async function getAvailableTags() {
    const problems = await fetchAllProblems();
    const tagSet = new Set();

    problems.forEach(p => {
        if (p.tags) {
            p.tags.forEach(tag => tagSet.add(tag));
        }
    });

    return Array.from(tagSet).sort();
}
