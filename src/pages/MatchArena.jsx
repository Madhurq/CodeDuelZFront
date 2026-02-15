import { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { useWebSocket } from '../hooks/useWebSocket';

const STARTER_CODE = {
    javascript: `// Write your solution here\n// Read input from stdin, write output to stdout\nconst readline = require('readline');\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on('line', (line) => lines.push(line));\nrl.on('close', () => {\n    // Your solution here\n    console.log(lines[0]);\n});`,
    python: `# Write your solution here\n# Read input from stdin, write output to stdout\nimport sys\ninput_data = sys.stdin.read().strip().split('\\n')\n# Your solution here\nprint(input_data[0])`,
    java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Read input and write output\n        String line = sc.nextLine();\n        System.out.println(line);\n    }\n}`,
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Read input and write output\n    string line;\n    getline(cin, line);\n    cout << line << endl;\n    return 0;\n}`,
};

// Map frontend language keys to LeetCode JSON code_snippets keys
const LANG_TO_SNIPPET_KEY = {
    cpp: 'cpp',
    python: 'python3',
    java: 'java',
    javascript: 'javascript',
};

function getStarterCode(language, problem) {
    const snippetKey = LANG_TO_SNIPPET_KEY[language] || language;
    const snippet = problem?.codeSnippets?.[snippetKey];
    return snippet || STARTER_CODE[language] || STARTER_CODE.cpp;
}

export default function MatchArena({ matchSettings, onMatchEnd, user }) {
    const username = user?.email?.split('@')[0];
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState(matchSettings?.language || 'cpp');
    const [timeLeft, setTimeLeft] = useState(matchSettings?.timeLimitSeconds || 900);
    const [matchStatus, setMatchStatus] = useState('in_progress');
    const [activeTab, setActiveTab] = useState('testcases'); // 'testcases' | 'output'
    const [outputPanelHeight, setOutputPanelHeight] = useState(220);

    // Use problem data sent by backend
    const problem = matchSettings?.problem;
    const startTimeMs = matchSettings?.startTimeMs;

    const {
        connected, matchResult, runResult, submitResult,
        isRunning, isSubmitting,
        subscribeToMatch, runCode, submitCode,
        clearMatchResult, clearRunResult, clearSubmitResult
    } = useWebSocket(username);

    // Subscribe to match updates
    useEffect(() => {
        if (matchSettings?.matchId && connected) {
            subscribeToMatch(matchSettings.matchId);
        }
    }, [matchSettings?.matchId, connected, subscribeToMatch]);

    // Handle match result (winner declared)
    useEffect(() => {
        if (matchResult) {
            const won = matchResult.winnerName === username;
            setMatchStatus(won ? 'won' : 'lost');
            clearMatchResult();
        }
    }, [matchResult, username, clearMatchResult]);

    // Switch to output tab when results arrive
    useEffect(() => {
        if (runResult || submitResult) {
            setActiveTab('output');
        }
    }, [runResult, submitResult]);

    // Initialize code with problem-specific boilerplate
    useEffect(() => {
        setCode(getStarterCode(language, problem));
    }, [language, problem]);

    // Timer - synced from server start time
    useEffect(() => {
        if (matchStatus !== 'in_progress') return;
        const timeLimitSeconds = matchSettings?.timeLimitSeconds || 900;

        const tick = () => {
            if (startTimeMs) {
                const elapsed = Math.floor((Date.now() - startTimeMs) / 1000);
                const remaining = Math.max(0, timeLimitSeconds - elapsed);
                setTimeLeft(remaining);
                if (remaining <= 0) setMatchStatus('lost');
            } else {
                setTimeLeft((prev) => {
                    if (prev <= 1) { setMatchStatus('lost'); return 0; }
                    return prev - 1;
                });
            }
        };

        tick();
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, [matchStatus, startTimeMs, matchSettings?.timeLimitSeconds]);

    const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    const handleRun = useCallback(() => {
        if (matchSettings?.matchId) {
            clearRunResult();
            runCode(matchSettings.matchId, code, language);
        }
    }, [matchSettings?.matchId, code, language, runCode, clearRunResult]);

    const handleSubmit = useCallback(() => {
        if (matchSettings?.matchId) {
            clearSubmitResult();
            submitCode(matchSettings.matchId, code, language);
        }
    }, [matchSettings?.matchId, code, language, submitCode, clearSubmitResult]);

    const opponent = matchSettings?.player1?.name === username ? matchSettings?.player2 : matchSettings?.player1;

    // Get the latest result to display (run or submit)
    const currentResult = submitResult || runResult;
    const resultLabel = submitResult ? 'Submission' : 'Run';

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
                    {opponent && (
                        <div className="flex items-center gap-2 bg-surface-alt px-3 py-1.5 rounded-lg border border-border">
                            <span className="text-xs text-text-secondary">vs</span>
                            <span className="text-sm font-semibold text-text">{opponent.name}</span>
                        </div>
                    )}
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
                                    View on LeetCode ↗
                                </a>
                            )}
                            {/* Description */}
                            <div className="text-text-secondary text-sm whitespace-pre-wrap leading-relaxed mt-4">
                                {problem.description}
                            </div>

                            {/* Examples */}
                            {problem.examples && problem.examples.length > 0 && (
                                <div style={{ marginTop: '16px' }}>
                                    {problem.examples.map((ex, i) => (
                                        <div key={i} style={{ marginTop: '12px' }}>
                                            <strong className="text-text text-sm">Example {ex.num}:</strong>
                                            <pre style={{
                                                background: '#1e1e1e',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                marginTop: '4px',
                                                whiteSpace: 'pre-wrap',
                                                color: '#d4d4d4',
                                                fontSize: '13px',
                                                lineHeight: '1.5'
                                            }}>
                                                {ex.text}
                                            </pre>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Constraints */}
                            {problem.constraints && problem.constraints.length > 0 && (
                                <div style={{ marginTop: '16px' }}>
                                    <strong className="text-text text-sm">Constraints:</strong>
                                    <ul style={{ marginTop: '4px', paddingLeft: '20px' }}>
                                        {problem.constraints.map((c, i) => (
                                            <li key={i} className="text-text-secondary text-sm" style={{ marginTop: '4px' }}>
                                                <code style={{ background: '#1e1e1e', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>
                                                    {c}
                                                </code>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-text-secondary">Loading problem...</p>
                        </div>
                    )}
                </div>

                {/* Editor + Output Panel */}
                <div className="flex-1 flex flex-col">
                    {/* Editor Toolbar */}
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
                        <div className="flex items-center gap-3">
                            {/* Run Button */}
                            <button
                                onClick={handleRun}
                                disabled={matchStatus !== 'in_progress' || isRunning || isSubmitting}
                                className="px-4 py-1.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
                                style={{
                                    background: 'rgba(34, 197, 94, 0.15)',
                                    color: '#22c55e',
                                    border: '1px solid rgba(34, 197, 94, 0.3)',
                                }}
                                onMouseEnter={(e) => { if (!e.target.disabled) e.target.style.background = 'rgba(34, 197, 94, 0.25)'; }}
                                onMouseLeave={(e) => { e.target.style.background = 'rgba(34, 197, 94, 0.15)'; }}
                            >
                                {isRunning ? (
                                    <>
                                        <span className="inline-block w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></span>
                                        Running...
                                    </>
                                ) : (
                                    <>▶ Run</>
                                )}
                            </button>
                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={matchStatus !== 'in_progress' || isRunning || isSubmitting}
                                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 flex items-center gap-2 transition-all"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Judging...
                                    </>
                                ) : (
                                    <>🚀 Submit</>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Code Editor */}
                    <div style={{ flex: 1, minHeight: 0 }}>
                        <Editor
                            height="100%"
                            language={language === 'cpp' ? 'cpp' : language}
                            theme="vs-dark"
                            value={code}
                            onChange={(v) => setCode(v || '')}
                            options={{ fontSize: 14, minimap: { enabled: false }, padding: { top: 16 } }}
                        />
                    </div>

                    {/* Output / Test Results Panel */}
                    <div
                        className="bg-surface border-t border-border"
                        style={{ height: `${outputPanelHeight}px`, minHeight: '100px', maxHeight: '400px' }}
                    >
                        {/* Panel Tabs */}
                        <div className="flex items-center justify-between border-b border-border px-4 py-1">
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setActiveTab('testcases')}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors ${activeTab === 'testcases'
                                            ? 'text-text bg-surface-alt border border-b-0 border-border'
                                            : 'text-text-secondary hover:text-text'
                                        }`}
                                >
                                    📋 Test Cases
                                </button>
                                <button
                                    onClick={() => setActiveTab('output')}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 ${activeTab === 'output'
                                            ? 'text-text bg-surface-alt border border-b-0 border-border'
                                            : 'text-text-secondary hover:text-text'
                                        }`}
                                >
                                    📤 {resultLabel} Result
                                    {currentResult && (
                                        <span className={`inline-block w-2 h-2 rounded-full ${currentResult.status === 'ACCEPTED' ? 'bg-green-400' : 'bg-red-400'
                                            }`}></span>
                                    )}
                                </button>
                            </div>
                            {currentResult && (
                                <div className={`text-xs font-bold px-2 py-0.5 rounded ${currentResult.status === 'ACCEPTED'
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {currentResult.status === 'ACCEPTED'
                                        ? `✅ All Passed (${currentResult.totalPassed}/${currentResult.totalTests})`
                                        : `❌ ${currentResult.status?.replace(/_/g, ' ')} (${currentResult.totalPassed}/${currentResult.totalTests})`
                                    }
                                </div>
                            )}
                        </div>

                        {/* Panel Content */}
                        <div className="overflow-y-auto p-4" style={{ height: `calc(100% - 36px)` }}>
                            {activeTab === 'testcases' && (
                                <div>
                                    {problem?.testCases && problem.testCases.length > 0 ? (
                                        problem.testCases.map((tc, i) => (
                                            <div key={i} className="mb-3 bg-surface-alt rounded-lg p-3 border border-border">
                                                <div className="text-xs font-semibold text-text-secondary mb-1">Test Case {i + 1}</div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <div className="text-xs text-text-secondary mb-1">Input</div>
                                                        <pre className="text-xs text-text bg-background rounded p-2 whitespace-pre-wrap">{tc.input || '(empty)'}</pre>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-text-secondary mb-1">Expected Output</div>
                                                        <pre className="text-xs text-text bg-background rounded p-2 whitespace-pre-wrap">{tc.expectedOutput || '(empty)'}</pre>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-text-secondary text-sm text-center py-4">
                                            No test cases available. Check the problem examples above.
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'output' && (
                                <div>
                                    {(isRunning || isSubmitting) && (
                                        <div className="flex items-center justify-center py-8 gap-3">
                                            <span className="inline-block w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin"></span>
                                            <span className="text-text-secondary font-semibold">
                                                {isRunning ? 'Running your code...' : 'Judging your submission...'}
                                            </span>
                                        </div>
                                    )}

                                    {!isRunning && !isSubmitting && currentResult && (
                                        <>
                                            {/* Compilation Error */}
                                            {currentResult.compilationError && (
                                                <div className="mb-3 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                                    <div className="text-xs font-semibold text-red-400 mb-1">⚠️ Compilation Error</div>
                                                    <pre className="text-xs text-red-300 whitespace-pre-wrap font-mono">{currentResult.compilationError}</pre>
                                                </div>
                                            )}

                                            {/* Per-test results */}
                                            {currentResult.testCaseResults?.map((tc, i) => (
                                                <div key={i} className={`mb-2 rounded-lg p-3 border ${tc.passed
                                                        ? 'bg-green-500/5 border-green-500/20'
                                                        : 'bg-red-500/5 border-red-500/20'
                                                    }`}>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={`text-base ${tc.passed ? 'text-green-400' : 'text-red-400'}`}>
                                                            {tc.passed ? '✅' : '❌'}
                                                        </span>
                                                        <span className={`text-xs font-semibold ${tc.passed ? 'text-green-400' : 'text-red-400'}`}>
                                                            Test Case {i + 1} — {tc.passed ? 'Passed' : 'Failed'}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <div>
                                                            <div className="text-xs text-text-secondary mb-1">Input</div>
                                                            <pre className="text-xs text-text bg-background rounded p-2 whitespace-pre-wrap max-h-20 overflow-auto">{tc.input || '(empty)'}</pre>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-text-secondary mb-1">Expected</div>
                                                            <pre className="text-xs text-text bg-background rounded p-2 whitespace-pre-wrap max-h-20 overflow-auto">{tc.expectedOutput || '(empty)'}</pre>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-text-secondary mb-1">Your Output</div>
                                                            <pre className={`text-xs rounded p-2 whitespace-pre-wrap max-h-20 overflow-auto ${tc.passed ? 'text-green-300 bg-green-500/5' : 'text-red-300 bg-red-500/5'
                                                                }`}>{tc.actualOutput || '(empty)'}</pre>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    )}

                                    {!isRunning && !isSubmitting && !currentResult && (
                                        <div className="text-text-secondary text-sm text-center py-8">
                                            Click <strong>▶ Run</strong> to test your code against the test cases, or <strong>🚀 Submit</strong> to judge and compete.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Match Result Modal */}
            {matchStatus !== 'in_progress' && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-surface rounded-2xl p-8 max-w-md w-full mx-4 text-center border border-border">
                        <div className="text-6xl mb-4">{matchStatus === 'won' ? '🏆' : '😔'}</div>
                        <h2 className="text-3xl font-bold mb-2 text-text">{matchStatus === 'won' ? 'Victory!' : 'Defeat'}</h2>
                        <p className="text-text-secondary mb-2">
                            {matchStatus === 'won' ? 'You solved it first! All test cases passed!' : 'Better luck next time!'}
                        </p>
                        {submitResult && (
                            <p className="text-sm text-text-secondary mb-4">
                                Test Cases: {submitResult.totalPassed}/{submitResult.totalTests} passed
                            </p>
                        )}
                        <button onClick={() => onMatchEnd && onMatchEnd(matchStatus === 'won')} className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold">
                            Return Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
