import { useState, useEffect } from 'react';
import MatchSearch from '../components/MatchSearch';
import QuickStats from '../components/QuickStats';
import { db } from '../config/firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Home({ user, onStartMatch }) {
  const [stats, setStats] = useState({
    matches: 0,
    wins: 0,
    losses: 0,
    rating: 1000,
    winRate: 0
  });
  const [loading, setLoading] = useState(false);

  // Load user stats from Firestore
  useEffect(() => {
    if (!user) return;

    const loadStats = async () => {
      try {
        // Set a timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          setLoading(false);
          console.warn('Stats loading timeout - using default values');
        }, 5000); // 5 second timeout

        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        clearTimeout(timeoutId);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setStats({
            matches: data.matches || 0,
            wins: data.wins || 0,
            losses: data.losses || 0,
            rating: data.rating || 1000,
            winRate: data.matches > 0 ? Math.round((data.wins / data.matches) * 100) : 0
          });
        } else {
          // First time user - create default stats
          const defaultStats = {
            matches: 0,
            wins: 0,
            losses: 0,
            rating: 1000,
            createdAt: new Date(),
            email: user.email
          };
          await setDoc(userDocRef, defaultStats);
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  // Handle match found - navigate to arena
  const handleMatchFound = (settings) => {
    if (onStartMatch) {
      onStartMatch(settings);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-[1200px] mx-auto p-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
          <MatchSearch onMatchFound={handleMatchFound} />
          <QuickStats stats={stats} loading={loading} />
        </div>

        {/* How It Works Section */}
        <div className="mt-16 mb-12">
          <h2 className="text-4xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-br from-primary to-secondary relative after:content-[''] after:absolute after:-bottom-3 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-gradient-to-r after:from-primary after:to-secondary after:rounded-sm">
            ⚔️ How CodeDuelZ Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '🎯', title: '1. Choose Your Challenge', desc: 'Select difficulty level and your preferred programming language. Get matched with opponents of similar skill.' },
              { icon: '👥', title: '2. Get Matched', desc: 'Our intelligent matchmaking system pairs you with a worthy opponent in real-time for a fair competition.' },
              { icon: '⏱️', title: '3. Code & Compete', desc: 'Solve challenging problems against the clock. Write clean, efficient code to outperform your opponent.' },
              { icon: '🏆', title: '4. Climb the Ranks', desc: 'Win battles to increase your rating, earn achievements, and rise through competitive ranks.' }
            ].map((feature, index) => (
              <div key={index} className="bg-surface border-2 border-border rounded-xl p-8 text-center transition-all duration-300 relative overflow-hidden group hover:border-primary hover:-translate-y-2 hover:shadow-lg">
                <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent transition-all duration-600 group-hover:left-full"></div>
                <div className="text-5xl mb-4 inline-block group-hover:animate-[spin_0.7s_ease-in-out]">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-text">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed text-base">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Highlight */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 my-12 p-12 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border-2 border-border">
          {[
            { number: '10+', label: 'Programming Languages' },
            { number: '500+', label: 'Practice Problems' },
            { number: '24/7', label: 'Live Matchmaking' },
            { number: '∞', label: 'Learning Opportunities' }
          ].map((item, index) => (
            <div key={index} className="text-center p-6 bg-abc rounded-xl transition-all cursor-pointer hover:scale-110 hover:shadow-md ">
              <div className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-primary to-secondary mb-2">{item.number}</div>
              <div className="text-sm font-semibold text-text-secondary">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto bg-gradient-to-br from-slate-800 to-slate-900 text-slate-200 py-12 border-t-4 border-primary [border-image:linear-gradient(90deg,var(--color-primary),var(--color-secondary))_1]">
        <div className="max-w-[1200px] mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-lg font-bold mb-4 text-white">⚔️ CodeDuelZ</h4>
            <p className="text-slate-400 leading-relaxed text-sm max-w-sm">The ultimate 1v1 competitive coding platform. Sharpen your skills, compete with peers, and become a coding champion.</p>
          </div>
          {[
            { title: 'Platform', links: ['How It Works', 'Leaderboard', 'Tournaments', 'Practice Arena'] },
            { title: 'Resources', links: ['Documentation', 'API Reference', 'Community', 'Support'] },
            { title: 'Connect', links: ['GitHub', 'Discord', 'Twitter', 'LinkedIn'] }
          ].slice(0, 3).map((section, idx) => (
            /* Adjusting slice if only showing specific cols, currently mapped all in App.css */
            <div key={idx}>
              <h4 className="text-lg font-bold mb-4 text-white">{section.title}</h4>
              <ul className="list-none space-y-3 text-sm text-slate-400">
                {section.links.map((link) => (
                  <li key={link} className="hover:text-white hover:pl-1 transition-all cursor-pointer">{link}</li>
                ))}
              </ul>
            </div>
          )).slice(0, 3)}
          {/* Note: The original CSS had 4 columns (1 big + 3 small). The map above produces 3 small columns correctly if mapped right. */}
        </div>
        <div className="max-w-[1200px] mx-auto px-8 pt-6 border-t border-white/10 text-center">
          <p className="text-slate-400 text-sm">&copy; 2026 CodeDuelZ. Built with ❤️ for developers.</p>
        </div>
      </footer>
    </div>
  );
}
