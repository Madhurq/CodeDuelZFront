import { useState, useEffect } from 'react';
import { getMatchHistory } from '../services/api';

export default function MatchHistory({ onViewProfile }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMatchHistory();
  }, []);

  const fetchMatchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMatchHistory();
      setMatches(data || []);
    } catch (err) {
      console.error('Error fetching match history:', err);
      setError('Failed to load match history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return '-';
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    return `${diffMins}m ${diffSecs}s`;
  };

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-text-secondary">📜 Match History</h2>
        <div className="text-center py-8 animate-pulse">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-text-secondary">Loading match history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-text-secondary">📜 Match History</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchMatchHistory}
            className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-8 shadow-sm transition-all relative overflow-hidden hover:shadow-lg transition-colors duration-300">
      {/* Top gradient border effect */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-secondary">📜 Match History</h2>
        <button
          onClick={fetchMatchHistory}
          className="text-sm text-primary hover:text-primary-dark transition-all"
          title="Refresh"
        >
          🔄 Refresh
        </button>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-12 bg-surface-alt rounded-xl border-2 border-dashed border-border">
          <div className="text-5xl mb-4">🎮</div>
          <p className="text-text-secondary mb-2">No matches played yet</p>
          <p className="text-sm text-text-secondary">Start a battle to see your match history!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {matches.map((match) => (
            <div
              key={match.matchId}
              className={`p-4 rounded-xl border-2 transition-all hover:-translate-y-0.5 hover:shadow-md ${match.result === 'WIN'
                  ? 'border-green-500/30 bg-green-500/5 hover:border-green-500/50'
                  : match.result === 'LOSS'
                    ? 'border-red-500/30 bg-red-500/5 hover:border-red-500/50'
                    : 'border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/50'
                }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {match.result === 'WIN' ? '🏆' : match.result === 'LOSS' ? '💔' : '🤝'}
                  </span>
                  <div>
                    <span className={`font-bold ${match.result === 'WIN' ? 'text-green-400' : match.result === 'LOSS' ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                      {match.result === 'WIN' ? 'Victory' : match.result === 'LOSS' ? 'Defeat' : 'Draw'}
                    </span>
                    <p className="text-sm text-text-secondary">
                      vs {match.opponentName || `Player #${match.opponentId}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-secondary">{formatDate(match.startTime)}</p>
                  <p className="text-xs text-text-secondary">
                    Duration: {calculateDuration(match.startTime, match.endTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                <div className="text-sm">
                  <span className="text-text-secondary">Problem: </span>
                  <span className="text-text font-medium">
                    {match.problemTitle || `Problem #${match.problemId}`}
                  </span>
                </div>
                {onViewProfile && match.opponentId && (
                  <button
                    onClick={() => onViewProfile(match.opponentId)}
                    className="text-xs text-primary hover:text-primary-dark transition-all font-semibold"
                  >
                    View Opponent →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {matches.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-text">{matches.length}</div>
            <div className="text-xs text-text-secondary">Total Matches</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              {matches.filter(m => m.result === 'WIN').length}
            </div>
            <div className="text-xs text-text-secondary">Wins</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">
              {matches.filter(m => m.result === 'LOSS').length}
            </div>
            <div className="text-xs text-text-secondary">Losses</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">
              {matches.length - matches.filter(m => m.result === 'WIN').length - matches.filter(m => m.result === 'LOSS').length}
            </div>
            <div className="text-xs text-text-secondary">Draws</div>
          </div>
        </div>
      )}
    </div>
  );
}
