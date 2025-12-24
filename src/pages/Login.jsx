// src/pages/Login.jsx
import { useState } from 'react';
import { auth } from '../config/firebase.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider 
} from 'firebase/auth';
import '../styles/Login.css';

const googleProvider = new GoogleAuthProvider();

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Side - Aesthetic Visual */}
      <div className="login-left">
        <div className="brand-content">
          <div className="brand-logo">⚔️</div>
          <h1 className="brand-name">CodeDuelZ</h1>
          <p className="brand-tagline">Where Code Warriors Battle</p>
          
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <div>
                <h3>Real-time Battles</h3>
                <p>Compete with developers worldwide</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <div>
                <h3>Track Progress</h3>
                <p>Monitor your competitive stats</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏆</span>
              <div>
                <h3>Climb Ranks</h3>
                <p>Rise through the leaderboards</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right">
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue your coding journey</p>
          </div>

          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleEmailAuth} className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                minLength="6"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="divider">OR</div>

          <button 
            onClick={handleGoogleSignIn} 
            disabled={loading}
            className="btn-google"
          >
            <span>🔗 Sign in with Google</span>
          </button>

          <div className="toggle-auth">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <button 
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="link-btn"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button 
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="link-btn"
                >
                  Create One
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
