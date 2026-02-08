import { useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

export default function MatchSearch({ onMatchFound, username }) {
  const [difficulty, setDifficulty] = useState('easy');
  const [language, setLanguage] = useState('cpp');
  const { connected, matchData, joinQueue, leaveQueue, clearMatchData } = useWebSocket(username);
  const [searching, setSearching] = useState(false);
  const [searchTime, setSearchTime] = useState(0);

  // Search timer
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

  return (
    <div className="bg-surface border border-border rounded-xl p-8 shadow-sm transition-all relative overflow-hidden hover:shadow-lg group">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-secondary">🎯 Find a Match</h2>
        <span className={`text-xs px-2 py-1 rounded ${connected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {connected ? '● Online' : '○ Connecting...'}
        </span>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <label className="text-sm font-semibold text-text">Difficulty</label>
        <div className="grid grid-cols-3 gap-3">
          {['easy', 'medium', 'hard'].map((level) => (
            <button
              key={level}
              className={`p-3 rounded-lg border-2 font-bold transition-all ${difficulty === level
                ? 'bg-gradient-to-br from-primary to-secondary text-white border-primary'
                : 'bg-surface-alt text-text border-border hover:border-primary'}`}
              onClick={() => setDifficulty(level)}
              disabled={searching}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <label className="text-sm font-semibold text-text">Language</label>
        <select
          className="p-3 border-2 border-border rounded-lg bg-selector text-text focus:border-primary"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={searching}
        >
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
        </select>
      </div>

      {searching ? (
        <button className="w-full p-3 rounded-lg border-2 border-red-500 text-red-400 bg-red-500/10 font-bold hover:bg-red-500/20" onClick={handleCancel}>
          ✕ Cancel
        </button>
      ) : (
        <button
          className="w-full p-3 rounded-lg bg-gradient-to-br from-primary to-secondary text-white font-bold hover:opacity-90 disabled:opacity-50"
          onClick={handleSearch}
          disabled={!connected}
        >
          ⚔️ Find Match
        </button>
      )}

      {searching && (
        <div className="mt-4 p-4 rounded-lg border-l-4 border-primary bg-primary/10">
          <div className="font-bold">🔍 Searching... {Math.floor(searchTime / 60)}:{(searchTime % 60).toString().padStart(2, '0')}</div>
          <p className="text-sm text-text-secondary mt-1">Waiting for opponent</p>
        </div>
      )}
    </div>
  );
}
