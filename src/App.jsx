import { useState, useEffect } from 'react';
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  // Show login if not authenticated
  if (!user) {
    return <Login />;
  }

  // Protect profile page - redirect to home if trying to access without being on profile
  const handlePageChange = (page) => {
    if (page === 'profile') {
      setCurrentPage('profile');
    } else {
      setCurrentPage('home');
    }
  };

  return (
    <>
      <Navbar 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        user={user}
      />
      {currentPage === 'home' && <Home user={user} />}
      {currentPage === 'profile' && <Profile user={user} />}
    </>
  );
}

export default App;
