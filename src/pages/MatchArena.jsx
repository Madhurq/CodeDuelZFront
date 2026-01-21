import { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { getRandomProblemWithStatement } from '../services/codeforces';

const STARTER_CODE = {
    javascript: `// Write your solution here
function solve(input) {
    
}`,
    python: `# Write your solution here
def solve(input):
    pass`,
    java: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
    }
}`,
    cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your solution here
    return 0;
}`,
    go: `package main

import "fmt"

func main() {
    // Write your solution here
}`,
    rust: `use std::io;

fn main() {
    // Write your solution here
}`
};

const LANGUAGE_MAP = {
    javascript: 'javascript',
    python: 'python',
    java: 'java',
    cpp: 'cpp',
    go: 'go',
    rust: 'rust'
};

export default function MatchArena({ matchSettings, onMatchEnd, user }) {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState(matchSettings?.language || 'cpp');
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
    const [testResults, setTestResults] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [matchStatus, setMatchStatus] = useState('in_progress');

    // Problem state - fetched from Codeforces
    const [problem, setProblem] = useState(null);
    const [problemLoading, setProblemLoading] = useState(true);
    const [problemError, setProblemError] = useState(null);

    // Fetch problem on mount
    useEffect(() => {
        const fetchProblem = async () => {
            try {
                setProblemLoading(true);
                setProblemError(null);
                const difficulty = matchSettings?.difficulty || 'medium';
                const fetchedProblem = await getRandomProblemWithStatement(difficulty);
                setProblem(fetchedProblem);
            } catch (error) {
                console.error('Error fetching problem:', error);
                setProblemError('Failed to load problem. Please try again.');
            } finally {
                setProblemLoading(false);
            }
        };
        fetchProblem();
    }, [matchSettings?.difficulty]);

    // Initialize code with starter template
    useEffect(() => {
        setCode(STARTER_CODE[language] || STARTER_CODE.cpp);
    }, [language]);

    // Timer countdown
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

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleRunCode = useCallback(() => {
        setTestResults({ running: true });

        // Simulate test execution
        setTimeout(() => {
            setTestResults({
                running: false,
                passed: 1,
                total: 2,
                cases: [
                    { input: '[2,7,11,15], 9', expected: '[0,1]', actual: '[0,1]', passed: true },
                    { input: '[3,2,4], 6', expected: '[1,2]', actual: 'Error', passed: false }
                ]
            });
        }, 1500);
    }, []);

    const handleSubmit = useCallback(() => {
        setIsSubmitting(true);

        // Simulate submission
        setTimeout(() => {
            setIsSubmitting(false);
            const won = Math.random() > 0.5; // 50% chance to win
            setMatchStatus(won ? 'won' : 'lost');
        }, 2000);
    }, []);

    const handleLeaveMatch = () => {
        if (onMatchEnd) {
            onMatchEnd(matchStatus === 'won');
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Top Bar */}
            <div className="bg-surface border-b border-border px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-text">⚔️ Code Battle</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${matchSettings?.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                        matchSettings?.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                        }`}>
                        {matchSettings?.difficulty?.charAt(0).toUpperCase() + matchSettings?.difficulty?.slice(1) || 'Medium'}
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    {/* Timer */}
                    <div className={`text-2xl font-mono font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-text'}`}>
                        ⏱️ {formatTime(timeLeft)}
                    </div>

                    <button
                        onClick={handleLeaveMatch}
                        className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all font-semibold"
                    >
                        Leave Match
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Problem Panel */}
                <div className="w-[400px] bg-surface border-r border-border overflow-y-auto p-6">
                    {problemLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                                <p className="text-text-secondary">Loading problem...</p>
                            </div>
                        </div>
                    ) : problemError ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <p className="text-red-400 mb-4">{problemError}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-4 py-2 bg-primary rounded-lg text-white"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    ) : problem ? (
                        <>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-text mb-2">{problem.title}</h2>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                            problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                problem.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-purple-500/20 text-purple-400'
                                        }`}>
                                        {problem.difficulty} ({problem.rating})
                                    </span>
                                    <a
                                        href={problem.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary text-xs hover:underline"
                                    >
                                        {problem.id} ↗
                                    </a>
                                </div>
                            </div>

                            <div className="prose prose-invert max-w-none space-y-4">
                                {/* Constraints (time/memory) */}
                                {problem.constraints && problem.constraints.length > 0 && (
                                    <div className="flex flex-wrap gap-3 text-xs text-text-secondary">
                                        {problem.constraints.map((c, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-surface-alt rounded border border-border">
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Problem Description */}
                                {problem.description && (
                                    <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                                        {problem.description}
                                    </div>
                                )}

                                {/* Examples */}
                                {problem.examples && problem.examples.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold text-text mb-3">Examples</h3>
                                        {problem.examples.map((example, idx) => (
                                            <div key={idx} className="bg-surface-alt rounded-lg p-4 mb-3 border border-border">
                                                <div className="mb-3">
                                                    <span className="text-text-secondary text-xs font-semibold block mb-1">Input:</span>
                                                    <pre className="text-primary text-sm bg-surface p-2 rounded overflow-x-auto">{example.input}</pre>
                                                </div>
                                                <div>
                                                    <span className="text-text-secondary text-xs font-semibold block mb-1">Output:</span>
                                                    <pre className="text-secondary text-sm bg-surface p-2 rounded overflow-x-auto">{example.output}</pre>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Tags */}
                                {problem.tags && problem.tags.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-border">
                                        <h3 className="text-xs font-semibold text-text-secondary mb-2">Topics</h3>
                                        <div className="flex flex-wrap gap-1">
                                            {problem.tags.map((tag, idx) => (
                                                <span key={idx} className="px-2 py-0.5 bg-surface-alt rounded text-xs text-text-secondary border border-border">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : null}
                </div>

                {/* Editor Panel */}
                <div className="flex-1 flex flex-col">
                    {/* Editor Header */}
                    <div className="bg-surface-alt border-b border-border px-4 py-2 flex items-center justify-between">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-surface border border-border rounded-lg px-3 py-1.5 text-text text-sm focus:outline-none focus:border-primary"
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="cpp">C++</option>
                            <option value="go">Go</option>
                            <option value="rust">Rust</option>
                        </select>

                        <div className="flex gap-2">
                            <button
                                onClick={handleRunCode}
                                disabled={testResults?.running || matchStatus !== 'in_progress'}
                                className="px-4 py-1.5 rounded-lg bg-surface border border-border text-text hover:border-primary transition-all text-sm font-medium disabled:opacity-50"
                            >
                                {testResults?.running ? '⏳ Running...' : '▶️ Run Code'}
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || matchStatus !== 'in_progress'}
                                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? '⏳ Submitting...' : '🚀 Submit'}
                            </button>
                        </div>
                    </div>

                    {/* Monaco Editor */}
                    <div className="flex-1">
                        <Editor
                            height="100%"
                            language={LANGUAGE_MAP[language]}
                            theme="vs-dark"
                            value={code}
                            onChange={(value) => setCode(value || '')}
                            options={{
                                fontSize: 14,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                padding: { top: 16 },
                                lineNumbers: 'on',
                                roundedSelection: true,
                                automaticLayout: true,
                                tabSize: 2,
                            }}
                        />
                    </div>

                    {/* Test Results Panel */}
                    {testResults && !testResults.running && (
                        <div className="bg-surface-alt border-t border-border p-4 max-h-48 overflow-y-auto">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="font-semibold text-text">Test Results:</span>
                                <span className={`text-sm ${testResults.passed === testResults.total ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {testResults.passed}/{testResults.total} passed
                                </span>
                            </div>
                            <div className="space-y-2">
                                {testResults.cases.map((tc, idx) => (
                                    <div key={idx} className={`p-3 rounded-lg border ${tc.passed ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span>{tc.passed ? '✅' : '❌'}</span>
                                            <span className="text-sm text-text">Test Case {idx + 1}</span>
                                        </div>
                                        <div className="text-xs text-text-secondary">
                                            Input: <code className="text-primary">{tc.input}</code>
                                        </div>
                                        <div className="text-xs text-text-secondary">
                                            Expected: <code className="text-secondary">{tc.expected}</code> |
                                            Got: <code className={tc.passed ? 'text-green-400' : 'text-red-400'}>{tc.actual}</code>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Opponent Panel */}
                <div className="w-[280px] bg-surface border-l border-border p-6">
                    <h3 className="text-lg font-bold text-text mb-4">👤 Opponent</h3>

                    <div className="bg-surface-alt rounded-xl p-4 border border-border mb-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                                ?
                            </div>
                            <div>
                                <div className="font-semibold text-text">Anonymous</div>
                                <div className="text-sm text-text-secondary">Rating: 1250</div>
                            </div>
                        </div>
                        <div className="text-xs text-text-secondary">
                            <div className="flex justify-between mb-1">
                                <span>Status:</span>
                                <span className="text-yellow-400">Coding...</span>
                            </div>
                            <div className="w-full bg-border rounded-full h-1.5 mt-2">
                                <div className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center text-text-secondary text-sm">
                        <p>🔒 Opponent's code is hidden</p>
                        <p className="mt-2">First to submit a correct solution wins!</p>
                    </div>
                </div>
            </div>

            {/* Match Result Modal */}
            {matchStatus !== 'in_progress' && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-surface rounded-2xl p-8 max-w-md w-full mx-4 text-center border border-border shadow-2xl">
                        <div className="text-6xl mb-4">
                            {matchStatus === 'won' ? '🏆' : '😔'}
                        </div>
                        <h2 className="text-3xl font-bold mb-2 text-text">
                            {matchStatus === 'won' ? 'Victory!' : 'Defeat'}
                        </h2>
                        <p className="text-text-secondary mb-6">
                            {matchStatus === 'won'
                                ? 'Congratulations! You solved the problem faster than your opponent.'
                                : 'Better luck next time! Keep practicing to improve.'}
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={handleLeaveMatch}
                                className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition-all"
                            >
                                Return Home
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
