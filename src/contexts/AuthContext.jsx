import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getCurrentUserProfile } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set dark mode by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Stop showing spinner as soon as Firebase resolves
      if (currentUser) {
        // Load profile in background — don't block the UI
        try {
          const profile = await getCurrentUserProfile();
          setDbUser(profile);
        } catch (error) {
          console.error('Failed to load user profile', error);
        }
      } else {
        setDbUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogout = useCallback(async (goOfflineFn) => {
    try {
      // Send explicit offline signal BEFORE Firebase signs out
      // so the backend marks the user offline immediately
      if (goOfflineFn) goOfflineFn();
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, dbUser, loading, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
