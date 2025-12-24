// src/App.jsx
import { useState, useEffect } from 'react';
import { auth } from './config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
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

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return <Login />;
  }

  return (
    <>
      <Navbar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        user={user}
        onLogout={handleLogout}
      />
      {currentPage === 'home' && <Home user={user} />}
      {currentPage === 'profile' && <Profile user={user} />}
    </>
  );
}

export default App;
