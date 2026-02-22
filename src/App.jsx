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
import Friends from './pages/Friends';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [matchSettings, setMatchSettings] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  // Set dark mode by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handlePageChange = (page) => {
    setIsPageTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsPageTransitioning(false);
    }, 150);
  };

  const handleLogout = async () => {
    try {
      setShowLogin(false);
      setCurrentPage('home');
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleViewUserProfile = (userId) => {
    setSelectedUserId(userId);
    handlePageChange('user-profile');
  };

  const handleBackToLeaderboard = () => {
    setSelectedUserId(null);
    handlePageChange('leaderboard');
  };

  const handleStartMatch = (settings) => {
    setMatchSettings(settings);
    handlePageChange('match-arena');
  };

  const handleMatchEnd = (won) => {
    setMatchSettings(null);
    handlePageChange('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping"></div>
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
          </div>
          <p className="text-text-secondary">Loading CodeDuelZ...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (showLogin) {
      return <Login onBack={() => setShowLogin(false)} />;
    }
    return <LandingPage onLoginClick={() => setShowLogin(true)} />;
  }

  const showNavbar = currentPage !== 'match-arena';

  return (
    <>
      {showNavbar && (
        <Navbar
          currentPage={currentPage}
          onPageChange={handlePageChange}
          user={user}
          onLogout={handleLogout}
        />
      )}
      <div className={`transition-all duration-200 ${isPageTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
        {currentPage === 'home' && <Home user={user} onStartMatch={handleStartMatch} />}
        {currentPage === 'friends' && <Friends user={user} onStartMatch={handleStartMatch} />}
        {currentPage === 'profile' && <Profile user={user} />}
        {currentPage === 'leaderboard' && <Leaderboard onViewProfile={handleViewUserProfile} />}
        {currentPage === 'user-profile' && (
          <UserProfile userId={selectedUserId} onBack={handleBackToLeaderboard} />
        )}
        {currentPage === 'match-arena' && (
          <MatchArena matchSettings={matchSettings} onMatchEnd={handleMatchEnd} user={user} />
        )}
      </div>
    </>
  );
}

export default App;
