import { useState, useEffect } from 'react';
import { getMatchHistory } from '../services/api';

export default function MatchHistory({ onViewProfile, matches: propMatches, loading: propLoading }) {
  const [matches, setMatches] = useState(propMatches || []);
  const [loading, setLoading] = useState(propLoading !== undefined ? propLoading : true);
  const [error, setError] = useState(null);

  // If parent provides matches, use them; otherwise fetch ourselves
  const isControlled = propMatches !== undefined;

  useEffect(() => {
    if (!isControlled) fetchMatchHistory();
  }, [isControlled]);

  useEffect(() => {
    if (isControlled && propMatches !== undefined) setMatches(propMatches);
  }, [propMatches, isControlled]);

  useEffect(() => {
    if (isControlled && propLoading !== undefined) setLoading(propLoading);
  }, [propLoading, isControlled]);

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
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return '-';
    const diffMs = new Date(endTime) - new Date(startTime);
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    return `${diffMins}m ${diffSecs}s`;
  };

  if (loading) {
    return (
      <div className="card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-surface-elevated animate-pulse"></div>
          <div className="h-6 w-40 bg-surface-elevated rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-surface-elevated rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-8">
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-error">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <p className="text-error mb-4">{error}</p>
          <button onClick={fetchMatchHistory} className="btn-secondary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
              <path d="M3 3v18h18"></path>
              <path d="M18 17V9"></path>
              <path d="M13 17V5"></path>
              <path d="M8 17v-3"></path>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Match History</h2>
            <p className="text-text-secondary text-sm">Your recent battles</p>
          </div>
        </div>
        <button
          onClick={fetchMatchHistory}
          className="p-2 rounded-lg hover:bg-surface-elevated text-text-secondary hover:text-accent transition-colors"
          title="Refresh"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
        </button>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-12 bg-surface-elevated rounded-xl border border-dashed border-border">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <p className="text-text-secondary mb-2">No matches yet</p>
          <p className="text-text-muted text-sm">Start a battle to see your history!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {matches.map((match) => (
            <div
              key={match.matchId}
              className={`p-4 rounded-xl border transition-all duration-200 hover:scale-[1.01] ${match.result === 'WIN'
                  ? 'bg-success/5 border-success/20 hover:border-success/40'
                  : match.result === 'LOSS'
                    ? 'bg-error/5 border-error/20 hover:border-error/40'
                    : 'bg-warning/5 border-warning/20 hover:border-warning/40'
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${match.result === 'WIN'
                      ? 'bg-success/20'
                      : match.result === 'LOSS'
                        ? 'bg-error/20'
                        : 'bg-warning/20'
                    }`}>
                    {match.result === 'WIN' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success">
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                        <path d="M4 22h16"></path>
                        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                      </svg>
                    ) : match.result === 'LOSS' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-error">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warning">
                        <path d="M16 3h5v5"></path>
                        <line x1="21" y1="3" x2="14" y2="10"></line>
                        <path d="M8 21H3v-5"></path>
                        <line x1="3" y1="21" x2="10" y2="14"></line>
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className={`font-bold ${match.result === 'WIN'
                        ? 'text-success'
                        : match.result === 'LOSS'
                          ? 'text-error'
                          : 'text-warning'
                      }`}>
                      {match.result === 'WIN' ? 'Victory' : match.result === 'LOSS' ? 'Defeat' : 'No Result'}
                    </div>
                    <div className="text-sm text-text-secondary">
                      vs {match.opponentName || `Player #${match.opponentId?.slice(0, 8)}`}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-text-secondary">{formatDate(match.startTime)}</div>
                  <div className="text-xs text-text-muted">{calculateDuration(match.startTime, match.endTime)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {matches.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{matches.length}</div>
            <div className="text-xs text-text-secondary">Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-success">{matches.filter(m => m.result === 'WIN').length}</div>
            <div className="text-xs text-text-secondary">Wins</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-error">{matches.filter(m => m.result === 'LOSS').length}</div>
            <div className="text-xs text-text-secondary">Losses</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-warning">{matches.length - matches.filter(m => m.result === 'WIN').length - matches.filter(m => m.result === 'LOSS').length}</div>
            <div className="text-xs text-text-secondary">No Result</div>
          </div>
        </div>
      )}
    </div>
  );
}
