import { useState, useEffect } from 'react';
//import MatchSearch from '../components/MatchSearch';
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
  const [loading, setLoading] = useState(true);

  // Load user stats from Firestore
  useEffect(() => {
    if (!user) return;

    const loadStats = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

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
          setStats({
            matches: 0,
            wins: 0,
            losses: 0,
            rating: 1000,
            winRate: 0
          });
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

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your stats...</div>;
  }

  return (
    <div className="container">
      <div className="home-grid">
        <MatchSearch onMatchFound={handleMatchFound} />
        <QuickStats stats={stats} />
      </div>
    </div>
  );
}
