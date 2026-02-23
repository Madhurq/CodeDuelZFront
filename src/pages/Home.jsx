import { useState, useEffect } from 'react';
import MatchSearch from '../components/MatchSearch';
import QuickStats from '../components/QuickStats';
import MatchHistory from '../components/MatchHistory';
import { apiGet } from '../services/api';
import logo from '../assets/logo.png';

export default function Home({ user, onStartMatch, wsConnected, wsMatchData, wsJoinQueue, wsLeaveQueue, wsClearMatchData }) {
  const [stats, setStats] = useState({
    matches: 0,
    wins: 0,
    losses: 0,
    rating: 1000,
    winRate: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await apiGet('/profile');
        const totalMatches = (data.wins || 0) + (data.losses || 0);
        setStats({
          matches: totalMatches,
          wins: data.wins || 0,
          losses: data.losses || 0,
          rating: data.rating || 1000,
          winRate: totalMatches > 0 ? Math.round((data.wins / totalMatches) * 100) : 0
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  const handleMatchFound = (settings) => {
    if (onStartMatch) {
      onStartMatch(settings);
    }
  };

  const steps = [
    { num: '01', title: 'Find Match', desc: 'Search for a random opponent or challenge a friend', icon: '🔍', action: 'search' },
    { num: '02', title: 'Get Problem', desc: 'Both players receive the same coding challenge', icon: '📝', action: 'match' },
    { num: '03', title: 'Code Battle', desc: 'Solve faster than your opponent to win', icon: '⚡', action: 'match' },
    { num: '04', title: 'Climb Ranks', desc: 'Win matches to increase your rating', icon: '🏆', action: 'leaderboard' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto p-6 lg:p-8">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Welcome back, <span className="text-gradient">{user?.email?.split('@')[0] || 'Champion'}</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Ready to prove you're the best coder? Your next battle awaits.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 mb-12">
          <MatchSearch onMatchFound={handleMatchFound} username={user?.email?.split('@')[0]} wsConnected={wsConnected} wsMatchData={wsMatchData} wsJoinQueue={wsJoinQueue} wsLeaveQueue={wsLeaveQueue} wsClearMatchData={wsClearMatchData} />
          <QuickStats stats={stats} loading={loading} />
        </div>

        {/* Match History */}
        <div className="mb-16">
          <MatchHistory />
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="text-accent">Works</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Four simple steps to become a coding champion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="card p-6 text-center group cursor-default"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <div className="text-xs text-accent font-bold mb-2">{step.num}</div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-text-secondary text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-elevated border border-border p-8 md:p-12">
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px]"></div>

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '10+', label: 'Languages', icon: '⚡' },
              { num: '500+', label: 'Problems', icon: '📚' },
              { num: '24/7', label: 'Live Matches', icon: '🎯' },
              { num: '∞', label: 'Fun', icon: '🚀' },
            ].map((item, idx) => (
              <div key={idx} className="group">
                <div className="text-4xl mb-2">{item.icon}</div>
                <div className="text-3xl md:text-4xl font-black text-gradient">{item.num}</div>
                <div className="text-text-secondary">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border bg-surface mt-auto py-12">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="CodeDuelZ" className="w-8 h-8" />
              <span className="font-bold">CodeDuelZ</span>
            </div>
            <div className="text-text-secondary text-sm">
              © 2026 CodeDuelZ. Crafted with precision.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
