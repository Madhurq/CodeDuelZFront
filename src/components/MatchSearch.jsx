import { useState } from 'react';

export default function MatchSearch({ onMatchFound }) {
  const [difficulty, setDifficulty] = useState('easy');
  const [language, setLanguage] = useState('javascript');
  const [searching, setSearching] = useState(false);
  const [matchFound, setMatchFound] = useState(false);

  const handleSearch = () => {
    setSearching(true);
    setMatchFound(false);

    // Simulate finding a match after 2 seconds
    setTimeout(() => {
      setSearching(false);
      setMatchFound(true);
      if (onMatchFound) {
        onMatchFound();
      }

      // Reset after showing result
      setTimeout(() => {
        setMatchFound(false);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-8 shadow-sm transition-all relative overflow-hidden hover:shadow-lg hover:-translate-y-0.5 group transition-colors duration-300">
      {/* Top gradient border effect */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-br from-primary to-secondary">🎯 Find a Match</h2>

      <div className="flex flex-col gap-2 mb-6">
        <label className="text-[0.9rem] font-semibold text-text">Select Difficulty</label>
        <div className="grid grid-cols-3 gap-3">
          {['easy', 'medium', 'hard'].map((level) => (
            <button
              key={level}
              className={`relative p-3.5 rounded-lg border-2 font-bold cursor-pointer transition-all overflow-hidden ${difficulty === level
                ? 'bg-gradient-to-br from-primary to-secondary text-white border-primary shadow-[0_4px_12px_rgba(59,130,246,0.3)]'
                : 'bg-surface-alt text-text border-border hover:border-primary-dark hover:bg-primary-light hover:-translate-y-0.5'
                }`}
              onClick={() => setDifficulty(level)}
              disabled={searching}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
              {difficulty !== level && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-secondary translate-x-[-100%] transition-transform duration-300 group-hover:translate-x-0"></div>}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <label className="text-[0.9rem] font-semibold text-text">Preferred Language</label>
        <select
          className="p-3.5 border-2 border-border rounded-lg text-[0.95rem] font-inherit transition-all bg-surface-alt text-text focus:outline-none focus:border-primary focus:bg-primary-light focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] focus:-translate-y-px"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={searching}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="go">Go</option>
          <option value="rust">Rust</option>
        </select>
      </div>

      <button
        className="w-full mt-4 p-3.5 rounded-lg border-none text-[0.95rem] font-bold cursor-pointer transition-all relative overflow-hidden bg-gradient-to-br from-primary to-secondary text-white shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(59,130,246,0.4)] active:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
        onClick={handleSearch}
        disabled={searching}
      >
        {searching ? '🔍 Searching for opponent...' : '⚔️ Start Battle'}
      </button>

      {matchFound && (
        <div className="mt-6 p-6 rounded-lg border-l-4 border-secondary bg-secondary/10 shadow-[0_4px_12px_rgba(16,185,129,0.2)] animate-[slideIn_0.4s_ease-out]">
          <div className="font-bold mb-2">✅ Match Found!</div>
          <p className="m-0 mt-2 text-[0.9rem]">
            Connecting to battle arena...
          </p>
        </div>
      )}
    </div>
  );
}
