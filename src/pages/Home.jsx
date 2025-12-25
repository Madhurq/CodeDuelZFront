import { useState, useEffect } from 'react';
import MatchSearch from '../components/MatchSearch';
import QuickStats from '../components/QuickStats';
import { db } from '../config/firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Home({ user }) {
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

  // Update stats when match is found
  const handleMatchFound = async () => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      
      // Simulate win/loss (50/50 chance)
      const isWin = Math.random() > 0.5;
      const ratingChange = isWin ? 10 : -5;

      const newStats = {
        matches: stats.matches + 1,
        wins: isWin ? stats.wins + 1 : stats.wins,
        losses: !isWin ? stats.losses + 1 : stats.losses,
        rating: Math.max(0, stats.rating + ratingChange),
        winRate: 0
      };

      // Calculate win rate
      newStats.winRate = Math.round((newStats.wins / newStats.matches) * 100);

      // Update Firestore
      await setDoc(userDocRef, newStats, { merge: true });
      setStats(newStats);
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  return (
    <div className="home-page">
      <div className="container">
        <div className="grid-2col">
          <MatchSearch onMatchFound={handleMatchFound} />
          <QuickStats stats={stats} loading={loading} />
        </div>

        {/* How It Works Section */}
        <div className="info-section">
          <h2 className="section-title-large">⚔️ How CodeDuelZ Works</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>1. Choose Your Challenge</h3>
              <p>Select difficulty level and your preferred programming language. Get matched with opponents of similar skill.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>2. Get Matched</h3>
              <p>Our intelligent matchmaking system pairs you with a worthy opponent in real-time for a fair competition.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏱️</div>
              <h3>3. Code & Compete</h3>
              <p>Solve challenging problems against the clock. Write clean, efficient code to outperform your opponent.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>4. Climb the Ranks</h3>
              <p>Win battles to increase your rating, earn achievements, and rise through competitive ranks.</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-highlight">
          <div className="highlight-item">
            <div className="highlight-number">10+</div>
            <div className="highlight-label">Programming Languages</div>
          </div>
          <div className="highlight-item">
            <div className="highlight-number">500+</div>
            <div className="highlight-label">Practice Problems</div>
          </div>
          <div className="highlight-item">
            <div className="highlight-number">24/7</div>
            <div className="highlight-label">Live Matchmaking</div>
          </div>
          <div className="highlight-item">
            <div className="highlight-number">∞</div>
            <div className="highlight-label">Learning Opportunities</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>⚔️ CodeDuelZ</h4>
            <p>The ultimate 1v1 competitive coding platform. Sharpen your skills, compete with peers, and become a coding champion.</p>
          </div>
          <div className="footer-section">
            <h4>Platform</h4>
            <ul>
              <li>How It Works</li>
              <li>Leaderboard</li>
              <li>Tournaments</li>
              <li>Practice Arena</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li>Documentation</li>
              <li>API Reference</li>
              <li>Community</li>
              <li>Support</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <ul>
              <li>GitHub</li>
              <li>Discord</li>
              <li>Twitter</li>
              <li>LinkedIn</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 CodeDuelZ. Built with ❤️ for developers.</p>
        </div>
      </footer>
    </div>
  );
}
