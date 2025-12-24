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
    <div className="card">
      <h2 className="card-title">🎯 Find a Match</h2>

      <div className="form-group">
        <label className="form-label">Select Difficulty</label>
        <div className="grid-3">
          <button
            className={`btn-select ${difficulty === 'easy' ? 'active' : ''}`}
            onClick={() => setDifficulty('easy')}
            disabled={searching}
          >
            Easy
          </button>
          <button
            className={`btn-select ${difficulty === 'medium' ? 'active' : ''}`}
            onClick={() => setDifficulty('medium')}
            disabled={searching}
          >
            Medium
          </button>
          <button
            className={`btn-select ${difficulty === 'hard' ? 'active' : ''}`}
            onClick={() => setDifficulty('hard')}
            disabled={searching}
          >
            Hard
          </button>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Preferred Language</label>
        <select
          className="select-field"
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
        className="btn btn-primary"
        onClick={handleSearch}
        disabled={searching}
        style={{ width: '100%', marginTop: '1rem' }}
      >
        {searching ? '🔍 Searching for opponent...' : '⚔️ Start Battle'}
      </button>

      {matchFound && (
        <div className="match-result">
          <div className="result-title">✅ Match Found!</div>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
            Connecting to battle arena...
          </p>
        </div>
      )}
    </div>
  );
}
