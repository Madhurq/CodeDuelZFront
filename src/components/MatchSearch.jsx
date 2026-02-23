import { useState, useEffect } from 'react';

export default function MatchSearch({ onMatchFound, username, wsConnected, wsMatchData, wsJoinQueue, wsLeaveQueue, wsClearMatchData }) {
  const [difficulty, setDifficulty] = useState('easy');
  const [language, setLanguage] = useState('cpp');
  const connected = wsConnected;
  const matchData = wsMatchData;
  const joinQueue = wsJoinQueue;
  const leaveQueue = wsLeaveQueue;
  const clearMatchData = wsClearMatchData;
  const [searching, setSearching] = useState(false);
  const [searchTime, setSearchTime] = useState(0);

  useEffect(() => {
    if (!searching) {
      setSearchTime(0);
      return;
    }
    const timer = setInterval(() => setSearchTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, [searching]);

  useEffect(() => {
    if (matchData) {
      setSearching(false);
      if (onMatchFound) {
        onMatchFound({ ...matchData, difficulty, language });
      }
      clearMatchData();
    }
  }, [matchData, onMatchFound, difficulty, language, clearMatchData]);

  const handleSearch = () => {
    if (!connected) return;
    setSearching(true);
    joinQueue(difficulty);
  };

  const handleCancel = () => {
    setSearching(false);
    leaveQueue();
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="card p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center shadow-glow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Find a Match</h2>
            <p className="text-text-secondary text-sm">Challenge a random opponent</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${connected
            ? 'bg-success/10 text-success'
            : 'bg-error/10 text-error'
          }`}>
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-success' : 'bg-error'} ${connected && 'animate-pulse'}`}></span>
          {connected ? 'Online' : 'Offline'}
        </div>
      </div>

      {/* Difficulty Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-secondary mb-3">Difficulty</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'easy', label: 'Easy', color: 'easy', icon: '🌱' },
            { value: 'medium', label: 'Medium', color: 'medium', icon: '🔥' },
            { value: 'hard', label: 'Hard', color: 'hard', icon: '💀' }
          ].map((level) => (
            <button
              key={level.value}
              onClick={() => setDifficulty(level.value)}
              disabled={searching}
              className={`relative p-4 rounded-xl border-2 font-semibold transition-all duration-200 ${difficulty === level.value
                  ? level.value === 'easy'
                    ? 'border-success bg-success/10 text-success'
                    : level.value === 'medium'
                      ? 'border-warning bg-warning/10 text-warning'
                      : 'border-error bg-error/10 text-error'
                  : 'border-border hover:border-border-light text-text-secondary hover:text-text'
                }`}
            >
              <span className="text-xl mb-1 block">{level.icon}</span>
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Language Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-text-secondary mb-3">Language</label>
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={searching}
            className="input appearance-none cursor-pointer pr-12"
          >
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {searching ? (
        <div className="space-y-4">
          <button
            onClick={handleCancel}
            className="w-full py-4 rounded-xl border-2 border-error bg-error/10 text-error font-semibold hover:bg-error/20 transition-all flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Cancel Search
          </button>

          {/* Searching Animation */}
          <div className="p-6 rounded-xl bg-surface-elevated border border-border">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
              <span className="text-accent font-medium">Searching for opponent...</span>
            </div>
            <div className="text-center text-3xl font-mono font-bold text-text">
              {formatTime(searchTime)}
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={handleSearch}
          disabled={!connected}
          className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          Find Match
        </button>
      )}
    </div>
  );
}
