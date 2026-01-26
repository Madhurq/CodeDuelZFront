// src/App.jsx
import { useState, useEffect } from 'react';
import { auth } from './config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import UserProfile from './pages/UserProfile';
import MatchArena from './pages/MatchArena';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [matchSettings, setMatchSettings] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentPage('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleViewUserProfile = (userId) => {
    setSelectedUserId(userId);
    setCurrentPage('user-profile');
  };

  const handleBackToLeaderboard = () => {
    setSelectedUserId(null);
    setCurrentPage('leaderboard');
  };

  const handleStartMatch = (settings) => {
    setMatchSettings(settings);
    setCurrentPage('match-arena');
  };

  const handleMatchEnd = (won) => {
    setMatchSettings(null);
    setCurrentPage('home');
    // TODO: Update user stats based on win/loss
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  // Show login/landing if not authenticated
  if (!user) {
    if (showLogin) {
      return <Login onBack={() => setShowLogin(false)} />;
    }
    return <LandingPage onLoginClick={() => setShowLogin(true)} />;
  }

  // Hide navbar during match
  const showNavbar = currentPage !== 'match-arena';

  return (
    <>
      {showNavbar && (
        <Navbar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          user={user}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'home' && <Home user={user} onStartMatch={handleStartMatch} />}
      {currentPage === 'profile' && <Profile user={user} />}
      {currentPage === 'leaderboard' && <Leaderboard onViewProfile={handleViewUserProfile} />}
      {currentPage === 'user-profile' && (
        <UserProfile userId={selectedUserId} onBack={handleBackToLeaderboard} />
      )}
      {currentPage === 'match-arena' && (
        <MatchArena matchSettings={matchSettings} onMatchEnd={handleMatchEnd} user={user} />
      )}
    </>
  );
}

export default App;

