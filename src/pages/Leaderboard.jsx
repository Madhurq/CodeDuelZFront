import { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/api';
import logo from '../assets/logo.png';

const TrophyIcon = ({ rank }) => {
  const getTrophyStyle = () => {
    switch (rank) {
      case 1: return { bg: 'from-yellow-400 to-yellow-600', emoji: '🥇', shadow: 'shadow-[0_0_20px_rgba(250,204,21,0.4)]' };
      case 2: return { bg: 'from-slate-300 to-slate-400', emoji: '🥈', shadow: 'shadow-[0_0_15px_rgba(203,213,225,0.3)]' };
      case 3: return { bg: 'from-amber-600 to-amber-700', emoji: '🥉', shadow: 'shadow-[0_0_15px_rgba(217,119,6,0.3)]' };
      default: return { bg: 'from-slate-600 to-slate-700', emoji: rank, shadow: '' };
    }
  };
  const style = getTrophyStyle();

  return (
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${style.bg} flex items-center justify-center text-xl font-bold ${style.shadow}`}>
      {style.emoji}
    </div>
  );
};

const CrownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
    <path d="M2 17l3-7 5 4 2-6 2 6 5-4 3 7H2z"></path>
    <path d="M2 17v4h20v-4"></path>
  </svg>
);

export default function Leaderboard({ onViewProfile }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getLeaderboard();
        setLeaderboard(data || []);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getTopThree = () => leaderboard.slice(0, 3);
  const getRest = () => leaderboard.slice(3);

  const refreshLeaderboard = () => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboard();
        setLeaderboard(data || []);
      } catch (err) {
        setError('Failed to refresh leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping"></div>
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center">
              <CrownIcon />
            </div>
          </div>
          <p className="text-text-secondary animate-pulse">Loading champions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-error">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Oops!</h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <button onClick={refreshLeaderboard} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.02]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/5 mb-6 relative">
            <CrownIcon />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-xs animate-bounce">
              ★
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            <span className="text-gradient">Leaderboard</span>
          </h1>
          <p className="text-text-secondary text-lg">Top developers ranked by rating</p>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={refreshLeaderboard}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-elevated border border-border hover:border-accent text-text-secondary hover:text-accent transition-all text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={loading ? 'animate-spin' : ''}>
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {leaderboard.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">No champions yet</h2>
            <p className="text-text-secondary mb-4">Be the first to join the competition!</p>
            <p className="text-sm text-text-muted">Start a match to appear on the leaderboard</p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            {getTopThree().length >= 3 && (
              <div className="flex justify-center items-end gap-4 mb-8">
                {/* 2nd Place */}
                {getTopThree()[1] && (
                  <div className="order-1 transform translate-y-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-3xl font-bold shadow-lg mb-3">
                        {getTopThree()[1].avatar ? (
                          <img src={getTopThree()[1].avatar} alt="" className="w-full h-full rounded-2xl object-cover" />
                        ) : (
                          getTopThree()[1].userName?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">🥈</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-sm truncate max-w-[80px] mx-auto">{getTopThree()[1].userName}</div>
                      <div className="text-lg font-black text-slate-300">{getTopThree()[1].rating}</div>
                    </div>
                    <div className="w-24 h-16 bg-gradient-to-t from-slate-400/30 to-transparent rounded-t-lg mx-auto mt-2"></div>
                  </div>
                )}

                {/* 1st Place */}
                {getTopThree()[0] && (
                  <div className="order-2">
                    <div className="relative">
                      <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-4xl font-bold shadow-[0_0_30px_rgba(250,204,21,0.5)] mb-3 ring-4 ring-yellow-400/20">
                        {getTopThree()[0].avatar ? (
                          <img src={getTopThree()[0].avatar} alt="" className="w-full h-full rounded-2xl object-cover" />
                        ) : (
                          getTopThree()[0].userName?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl animate-bounce">👑</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold truncate max-w-[100px] mx-auto">{getTopThree()[0].userName}</div>
                      <div className="text-2xl font-black text-yellow-400">{getTopThree()[0].rating}</div>
                    </div>
                    <div className="w-28 h-24 bg-gradient-to-t from-yellow-400/30 to-transparent rounded-t-lg mx-auto mt-2"></div>
                  </div>
                )}

                {/* 3rd Place */}
                {getTopThree()[2] && (
                  <div className="order-3 transform translate-y-8">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-3xl font-bold shadow-lg mb-3">
                        {getTopThree()[2].avatar ? (
                          <img src={getTopThree()[2].avatar} alt="" className="w-full h-full rounded-2xl object-cover" />
                        ) : (
                          getTopThree()[2].userName?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">🥉</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-sm truncate max-w-[80px] mx-auto">{getTopThree()[2].userName}</div>
                      <div className="text-lg font-black text-amber-600">{getTopThree()[2].rating}</div>
                    </div>
                    <div className="w-24 h-12 bg-gradient-to-t from-amber-600/30 to-transparent rounded-t-lg mx-auto mt-2"></div>
                  </div>
                )}
              </div>
            )}

            {/* Rest of the leaderboard */}
            <div className="space-y-3">
              {getRest().map((player, index) => (
                <div
                  key={player.userId}
                  className="card p-4 flex items-center gap-4 group hover:border-accent/50 transition-all"
                >
                  <div className="w-10 text-center font-bold text-text-muted">
                    {index + 4}
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-accent font-bold">
                    {player.avatar ? (
                      <img src={player.avatar} alt={player.userName} className="w-full h-full rounded-xl object-cover" />
                    ) : (
                      player.userName?.charAt(0).toUpperCase() || '?'
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-text truncate">{player.userName || 'Unknown'}</div>
                    <div className="text-sm text-text-muted">Joined {new Date().toLocaleDateString()}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-black text-gradient">{player.rating}</div>
                    <div className="text-xs text-text-muted">points</div>
                  </div>

                  <button
                    onClick={() => onViewProfile && onViewProfile(player.userId)}
                    className="px-4 py-2 rounded-lg bg-surface-elevated border border-border hover:border-accent hover:text-accent text-sm font-medium transition-all"
                  >
                    Profile
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Stats Footer */}
        {leaderboard.length > 0 && (
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            <div className="card p-4">
              <div className="text-2xl font-black text-gradient">{leaderboard.length}</div>
              <div className="text-sm text-text-secondary">Players</div>
            </div>
            <div className="card p-4">
              <div className="text-2xl font-black text-gradient">{leaderboard[0]?.rating || 0}</div>
              <div className="text-sm text-text-secondary">Top Rating</div>
            </div>
            <div className="card p-4">
              <div className="text-2xl font-black text-gradient">
                {Math.round(leaderboard.reduce((sum, p) => sum + (p.rating || 0), 0) / leaderboard.length)}
              </div>
              <div className="text-sm text-text-secondary">Avg Rating</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
