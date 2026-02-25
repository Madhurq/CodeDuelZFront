import { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { useWebSocket } from '../hooks/useWebSocket';

// LeetCode-style class/function fallback starters (used only when problem has no snippet)
const STARTER_CODE = {
  cpp: `class Solution {
public:
    // TODO: implement your solution
};`,
  java: `class Solution {
    // TODO: implement your solution
}`,
  python: `class Solution:
    def solve(self):
        # TODO: implement your solution
        pass`,
  javascript: `/**
 * @return {*}
 */
var solve = function() {
    // TODO: implement your solution
};`,
};

// LeetCode JSON uses these langSlug keys — try all aliases for each language
const LANG_SNIPPET_ALIASES = {
  cpp: ['cpp', 'c++', 'cplusplus'],
  java: ['java'],
  python: ['python3', 'python'],
  javascript: ['javascript', 'js'],
};

const LANGUAGES = [
  { value: 'cpp', label: 'C++', icon: '⚙️' },
  { value: 'java', label: 'Java', icon: '☕' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
];

function getStarterCode(language, problem) {
  const aliases = LANG_SNIPPET_ALIASES[language] || [language];
  for (const key of aliases) {
    const snippet = problem?.codeSnippets?.[key];
    if (snippet) return snippet;
  }
  return STARTER_CODE[language] || STARTER_CODE.cpp;
}

export default function MatchArena({ matchSettings, onMatchEnd, user }) {
  const username = user?.email?.split('@')[0];
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState(matchSettings?.language || 'cpp');
  const [timeLeft, setTimeLeft] = useState(matchSettings?.timeLimitSeconds || 900);
  const [matchStatus, setMatchStatus] = useState('in_progress');
  const [activeTab, setActiveTab] = useState('testcases');
  const [outputPanelHeight, setOutputPanelHeight] = useState(280);

  const problem = matchSettings?.problem;
  const startTimeMs = matchSettings?.startTimeMs;

  const {
    connected, matchResult, runResult, submitResult,
    isRunning, isSubmitting,
    subscribeToMatch, runCode, submitCode, timeoutMatch,
    clearRunResult, clearSubmitResult
  } = useWebSocket(username);

  useEffect(() => {
    if (matchSettings?.matchId && connected) {
      subscribeToMatch(matchSettings.matchId);
    }
  }, [matchSettings?.matchId, connected, subscribeToMatch]);

  useEffect(() => {
    if (matchResult) {
      const won = matchResult.winnerName === username;
      setMatchStatus(won ? 'won' : 'lost');
    }
  }, [matchResult, username]);

  useEffect(() => {
    if (runResult || submitResult) {
      setActiveTab('output');
    }
  }, [runResult, submitResult]);

  useEffect(() => {
    setCode(getStarterCode(language, problem));
  }, [language, problem]);

  useEffect(() => {
    if (matchStatus !== 'in_progress') return;
    const timeLimitSeconds = matchSettings?.timeLimitSeconds || 900;

    const tick = () => {
      if (startTimeMs) {
        const elapsed = Math.floor((Date.now() - startTimeMs) / 1000);
        const remaining = Math.max(0, timeLimitSeconds - elapsed);
        setTimeLeft(remaining);
        if (remaining <= 0) {
          setMatchStatus('lost');
          if (matchSettings?.matchId) timeoutMatch(matchSettings.matchId);
        }
      } else {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setMatchStatus('lost');
            if (matchSettings?.matchId) timeoutMatch(matchSettings.matchId);
            return 0;
          }
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
  const currentResult = submitResult || runResult;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'EASY': return 'bg-success/20 text-success border-success/30';
      case 'MEDIUM': return 'bg-warning/20 text-warning border-warning/30';
      case 'HARD': return 'bg-error/20 text-error border-error/30';
      default: return 'bg-accent/20 text-accent border-accent/30';
    }
  };

  return (
    <div className="min-h-screen bg-[#010205] flex flex-col">
      {/* Top Bar */}
      <div className="bg-surface border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            <span className="font-bold text-lg hidden sm:block">CodeDuelZ</span>
          </div>
          {problem?.difficulty && (
            <span className={`px-3 py-1 rounded-md text-xs font-semibold border ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className={`relative px-4 py-2 rounded-lg font-mono font-bold text-lg ${timeLeft < 60
            ? 'bg-error/20 text-error animate-pulse'
            : 'bg-surface-elevated text-text'
            }`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent animate-pulse"></div>
            <span className="relative z-10">⏱ {formatTime(timeLeft)}</span>
          </div>

          {opponent && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-elevated border border-border">
              <span className="text-xs text-text-muted">vs</span>
              <span className="font-medium text-text">{opponent.name}</span>
              <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
            </div>
          )}

          <button
            onClick={() => onMatchEnd && onMatchEnd(false)}
            className="px-4 py-2 rounded-lg bg-error/10 text-error hover:bg-error/20 font-medium transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span className="hidden sm:inline">Leave</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Problem Panel */}
        <div className="w-[380px] lg:w-[450px] bg-surface border-r border-border overflow-y-auto">
          <div className="p-6">
            {problem ? (
              <>
                <h2 className="text-2xl font-bold text-text mb-3">{problem.title}</h2>
                {problem.url && (
                  <a href={problem.url} target="_blank" rel="noopener noreferrer" className="text-accent text-xs hover:underline mb-4 inline-flex items-center gap-1">
                    View on LeetCode
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                )}

                <div className="text-text-secondary text-sm whitespace-pre-wrap leading-relaxed mb-6">
                  {problem.description?.replace(/\n\s*Example\s+\d+:[\s\S]*$/, '').trim()}
                </div>

                {problem.examples && problem.examples.length > 0 && (
                  <div className="space-y-4 mb-6">
                    {problem.examples.map((ex, i) => (
                      <div key={i} className="rounded-lg overflow-hidden border border-border">
                        <div className="bg-surface-elevated px-4 py-2 text-sm font-semibold text-text">
                          Example {ex.num}
                        </div>
                        <pre className="p-4 text-sm text-text-secondary whitespace-pre-wrap bg-background font-mono">
                          {ex.text}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}

                {problem.constraints && problem.constraints.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold text-text mb-2">Constraints</div>
                    <ul className="space-y-1">
                      {problem.constraints.map((c, i) => (
                        <li key={i} className="text-sm text-text-secondary font-mono">
                          <span className="text-accent">•</span> <code className="bg-surface-elevated px-2 py-0.5 rounded text-xs">{c}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                  </div>
                  <p className="text-text-secondary">Loading problem...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Editor + Output Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Editor Toolbar */}
          <div className="bg-[#0d0d10] border-b border-border px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted font-medium">Language</span>
              <div className="flex bg-surface-elevated rounded-lg border border-border overflow-hidden">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => setLanguage(lang.value)}
                    className={`px-3 py-1.5 text-sm font-medium transition-all flex items-center gap-1.5 ${language === lang.value
                      ? 'bg-accent text-black'
                      : 'text-text-secondary hover:text-text hover:bg-surface'
                      }`}
                  >
                    <span>{lang.icon}</span>
                    <span className="hidden sm:inline">{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRun}
                disabled={matchStatus !== 'in_progress' || isRunning || isSubmitting}
                className="px-4 py-1.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50 bg-success/10 text-success border border-success/30 hover:bg-success/20"
              >
                {isRunning ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Running
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    Run
                  </>
                )}
              </button>

              <button
                onClick={handleSubmit}
                disabled={matchStatus !== 'in_progress' || isRunning || isSubmitting}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-accent to-accent-dim text-black font-semibold text-sm hover:shadow-glow transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Judging
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language}
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || '')}
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                minimap: { enabled: false },
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                glyphMargin: false,
                folding: true,
                lineDecorationsWidth: 10,
                lineNumbersMinChars: 3,
              }}
            />
          </div>

          {/* Output Panel */}
          <div
            className="bg-surface border-t border-border"
            style={{ height: `${outputPanelHeight}px`, minHeight: '150px', maxHeight: '500px' }}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-1">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab('testcases')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors ${activeTab === 'testcases'
                    ? 'text-text bg-surface-elevated border border-b-0 border-border'
                    : 'text-text-secondary hover:text-text'
                    }`}
                >
                  Test Cases
                </button>
                <button
                  onClick={() => setActiveTab('output')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 ${activeTab === 'output'
                    ? 'text-text bg-surface-elevated border border-b-0 border-border'
                    : 'text-text-secondary hover:text-text'
                    }`}
                >
                  Output
                  {currentResult && (
                    <span className={`w-2 h-2 rounded-full ${currentResult.status === 'ACCEPTED' ? 'bg-success' : 'bg-error'}`}></span>
                  )}
                </button>
              </div>
              {currentResult && (
                <div className={`text-xs font-bold px-2 py-0.5 rounded ${currentResult.status === 'ACCEPTED'
                  ? 'bg-success/20 text-success'
                  : 'bg-error/20 text-error'
                  }`}>
                  {currentResult.status === 'ACCEPTED'
                    ? `✓ ${currentResult.totalPassed}/${currentResult.totalTests}`
                    : `✗ ${currentResult.totalPassed}/${currentResult.totalTests}`}
                </div>
              )}
            </div>

            <div className="overflow-y-auto p-4" style={{ height: `calc(100% - 36px)` }}>
              {activeTab === 'testcases' && (
                <div>
                  {problem?.testCases && problem.testCases.length > 0 ? (
                    problem.testCases.map((tc, i) => (
                      <div key={i} className="mb-3 bg-surface-elevated rounded-lg p-3 border border-border">
                        <div className="text-xs font-semibold text-text-secondary mb-2">Test Case {i + 1}</div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs text-text-muted mb-1">Input</div>
                            <pre className="text-xs text-text bg-background rounded p-2 whitespace-pre-wrap">{tc.input || '(empty)'}</pre>
                          </div>
                          <div>
                            <div className="text-xs text-text-muted mb-1">Expected</div>
                            <pre className="text-xs text-text bg-background rounded p-2 whitespace-pre-wrap">{tc.expectedOutput || '(empty)'}</pre>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-text-secondary text-sm text-center py-8">
                      No test cases available
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'output' && (
                <div>
                  {(isRunning || isSubmitting) && (
                    <div className="flex items-center justify-center py-8 gap-3">
                      <svg className="animate-spin h-6 w-6 text-accent" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      <span className="text-text-secondary font-medium">
                        {isRunning ? 'Running code...' : 'Judging submission...'}
                      </span>
                    </div>
                  )}

                  {!isRunning && !isSubmitting && currentResult && (
                    <>
                      {currentResult.compilationError && (
                        <div className="mb-3 bg-error/10 border border-error/30 rounded-lg p-3">
                          <div className="text-xs font-semibold text-error mb-1">Compilation Error</div>
                          <pre className="text-xs text-error/80 whitespace-pre-wrap font-mono">{currentResult.compilationError}</pre>
                        </div>
                      )}

                      {currentResult.testCaseResults?.map((tc, i) => (
                        <div key={i} className={`mb-2 rounded-lg p-3 border ${tc.passed
                          ? 'bg-success/5 border-success/20'
                          : 'bg-error/5 border-error/20'
                          }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-sm ${tc.passed ? 'text-success' : 'text-error'}`}>
                              {tc.passed ? '✓' : '✗'}
                            </span>
                            <span className={`text-xs font-semibold ${tc.passed ? 'text-success' : 'text-error'}`}>
                              Test Case {i + 1}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <div className="text-xs text-text-muted mb-1">Input</div>
                              <pre className="text-xs text-text-secondary bg-background rounded p-2 whitespace-pre-wrap max-h-20 overflow-auto">{tc.input || '(empty)'}</pre>
                            </div>
                            <div>
                              <div className="text-xs text-text-muted mb-1">Expected</div>
                              <pre className="text-xs text-text-secondary bg-background rounded p-2 whitespace-pre-wrap max-h-20 overflow-auto">{tc.expectedOutput || '(empty)'}</pre>
                            </div>
                            <div>
                              <div className="text-xs text-text-muted mb-1">Output</div>
                              <pre className={`text-xs rounded p-2 whitespace-pre-wrap max-h-20 overflow-auto ${tc.passed
                                ? 'text-success bg-success/5'
                                : 'text-error bg-error/5'
                                }`}>{tc.actualOutput || '(empty)'}</pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {!isRunning && !isSubmitting && !currentResult && (
                    <div className="text-text-secondary text-sm text-center py-8">
                      Click <strong className="text-success">Run</strong> to test your code, or <strong className="text-accent">Submit</strong> to compete.
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-2xl p-8 max-w-md w-full text-center scale-in">
            <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${matchStatus === 'won'
              ? 'bg-success/20'
              : 'bg-error/20'
              }`}>
              {matchStatus === 'won' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                  <path d="M4 22h16"></path>
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-error">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              )}
            </div>

            <h2 className={`text-4xl font-black mb-4 ${matchStatus === 'won' ? 'text-success' : 'text-error'
              }`}>
              {matchStatus === 'won' ? 'VICTORY!' : 'DEFEAT'}
            </h2>

            <p className="text-text-secondary mb-4">
              {matchStatus === 'won'
                ? 'You solved it first! Amazing work!'
                : 'Better luck next time. Keep practicing!'}
            </p>

            {submitResult && (
              <p className="text-sm text-text-muted mb-6">
                Test Cases: {submitResult.totalPassed}/{submitResult.totalTests} passed
              </p>
            )}

            <button
              onClick={() => onMatchEnd && onMatchEnd(matchStatus === 'won')}
              className="btn-primary w-full py-4"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
