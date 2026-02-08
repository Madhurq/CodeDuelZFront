import { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { useWebSocket } from '../hooks/useWebSocket';

const STARTER_CODE = {
    javascript: `// Write your solution here\nfunction solve(input) {\n    \n}`,
    python: `# Write your solution here\ndef solve(input):\n    pass`,
    java: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n    }\n}`,
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}`,
};

export default function MatchArena({ matchSettings, onMatchEnd, user }) {
    const username = user?.email?.split('@')[0];
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState(matchSettings?.language || 'cpp');
    const [timeLeft, setTimeLeft] = useState(matchSettings?.timeLimitSeconds || 900);
    const [matchStatus, setMatchStatus] = useState('in_progress');

    // Use problem data sent by backend (which now includes scraped description)
    const problem = matchSettings?.problem;

    const { connected, matchResult, subscribeToMatch, submitCode, clearMatchResult } = useWebSocket(username);

    // Subscribe to match updates
    useEffect(() => {
        if (matchSettings?.matchId && connected) {
            subscribeToMatch(matchSettings.matchId);
        }
    }, [matchSettings?.matchId, connected, subscribeToMatch]);

    // Handle match result
    useEffect(() => {
        if (matchResult) {
            const won = matchResult.winnerName === username;
            setMatchStatus(won ? 'won' : 'lost');
            clearMatchResult();
        }
    }, [matchResult, username, clearMatchResult]);

    // Initialize code
    useEffect(() => {
        setCode(STARTER_CODE[language] || STARTER_CODE.cpp);
    }, [language]);

    // Timer
    useEffect(() => {
        if (matchStatus !== 'in_progress') return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setMatchStatus('lost');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [matchStatus]);

    const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    const handleSubmit = useCallback(() => {
        if (matchSettings?.matchId) {
            submitCode(matchSettings.matchId, code, language);
        }
    }, [matchSettings?.matchId, code, language, submitCode]);

    const opponent = matchSettings?.player1?.name === username ? matchSettings?.player2 : matchSettings?.player1;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Top Bar */}
            <div className="bg-surface border-b border-border px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-text">⚔️ Code Battle</h1>
                    {problem?.difficulty && (
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${problem.difficulty === 'EASY' ? 'bg-green-500/20 text-green-400' :
                                problem.difficulty === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                            }`}>
                            {problem.difficulty}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-6">
                    <div className={`text-2xl font-mono font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-text'}`}>
                        ⏱️ {formatTime(timeLeft)}
                    </div>
                    <button onClick={() => onMatchEnd && onMatchEnd(false)} className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 font-semibold">
                        Leave
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Problem Panel */}
                <div className="w-[400px] bg-surface border-r border-border overflow-y-auto p-6">
                    {problem ? (
                        <>
                            <h2 className="text-2xl font-bold text-text mb-2">{problem.title}</h2>
                            {problem.url && (
                                <a href={problem.url} target="_blank" rel="noopener noreferrer" className="text-primary text-xs hover:underline mb-4 block">
                                    View on Codeforces ↗
                                </a>
                            )}
                            <div
                                className="text-text-secondary text-sm whitespace-pre-wrap leading-relaxed mt-4 problem-content"
                                dangerouslySetInnerHTML={{ __html: problem.description }}
                            />
                            {/* Note: dangerous HTML is needed because we scrape HTML from Codeforces */}
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-text-secondary">Loading problem...</p>
                        </div>
                    )}
                </div>

                {/* Editor Panel */}
                <div className="flex-1 flex flex-col">
                    <div className="bg-surface-alt border-b border-border px-4 py-2 flex items-center justify-between">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-surface border border-border rounded-lg px-3 py-1 text-text text-sm"
                        >
                            <option value="cpp">C++</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="javascript">JavaScript</option>
                        </select>
                        <button
                            onClick={handleSubmit}
                            disabled={matchStatus !== 'in_progress'}
                            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50"
                        >
                            🚀 Submit
                        </button>
                    </div>
                    <div className="flex-1">
                        <Editor
                            height="100%"
                            language={language === 'cpp' ? 'cpp' : language}
                            theme="vs-dark"
                            value={code}
                            onChange={(v) => setCode(v || '')}
                            options={{ fontSize: 14, minimap: { enabled: false }, padding: { top: 16 } }}
                        />
                    </div>
                </div>

                {/* Opponent Panel */}
                <div className="w-[250px] bg-surface border-l border-border p-6">
                    <h3 className="text-lg font-bold text-text mb-4">👤 Opponent</h3>
                    <div className="bg-surface-alt rounded-xl p-4 border border-border">
                        <div className="font-semibold text-text">{opponent?.name || 'Waiting...'}</div>
                        <div className="text-xs text-text-secondary mt-2">Status: Coding...</div>
                    </div>
                </div>
            </div>

            {/* Match Result Modal */}
            {matchStatus !== 'in_progress' && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-surface rounded-2xl p-8 max-w-md w-full mx-4 text-center border border-border">
                        <div className="text-6xl mb-4">{matchStatus === 'won' ? '🏆' : '😔'}</div>
                        <h2 className="text-3xl font-bold mb-2 text-text">{matchStatus === 'won' ? 'Victory!' : 'Defeat'}</h2>
                        <p className="text-text-secondary mb-6">
                            {matchStatus === 'won' ? 'You solved it first!' : 'Better luck next time!'}
                        </p>
                        <button onClick={() => onMatchEnd && onMatchEnd(matchStatus === 'won')} className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold">
                            Return Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
