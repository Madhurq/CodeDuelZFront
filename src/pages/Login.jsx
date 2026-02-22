import { useState } from 'react';
import { auth } from '../config/firebase.js';
import logo from '../assets/logo.png';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export default function Login({ onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

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

  const handleGithubSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (err) {
      setError(err.message || 'GitHub sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setResetSuccess('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSuccess('Check your inbox for the reset link!');
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  const signInFeatures = [
    { icon: '⚔️', title: 'Real-time Battles', desc: 'Challenge anyone, anytime' },
    { icon: '📊', title: 'Track Progress', desc: 'Watch your rating climb' },
    { icon: '🏆', title: 'Compete Globally', desc: 'Join the elite rankings' },
  ];

  const signUpFeatures = [
    { icon: '🎯', title: 'Daily Challenges', desc: 'New problems every day' },
    { icon: '🌍', title: 'Global Community', desc: 'Connect worldwide' },
    { icon: '💰', title: 'Win Prizes', desc: 'Monthly tournaments' },
  ];

  const features = isSignUp ? signUpFeatures : signInFeatures;
  const title = isSignUp ? 'Join the Battle' : 'CodeDuelZ';
  const subtitle = isSignUp ? 'Create your account to start competing' : 'Where coders become champions';

  return (
    <div id="login-page" className="min-h-screen bg-background overflow-hidden">

      {/* ====== DESKTOP: Sliding two-panel layout ====== */}
      <div className="hidden md:block relative min-h-screen">

        {/* Feature Panel — slides between left ↔ right */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full transition-transform duration-600 ease-in-out z-10 ${isSignUp ? 'translate-x-full' : 'translate-x-0'
            }`}
        >
          <div className="h-full bg-surface-elevated flex flex-col justify-center items-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20"></div>
            <div className="absolute top-20 left-20 w-80 h-80 bg-accent/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-20 right-20 w-60 h-60 bg-tertiary/10 rounded-full blur-[80px]"></div>

            <div className="relative z-10 text-center max-w-md px-6">
              <img src={logo} alt="CodeDuelZ" className="w-28 h-28 mx-auto mb-6" />
              <h1 className="text-4xl font-black mb-3"><span className="text-gradient">{title}</span></h1>
              <p className="text-text-secondary text-lg mb-10">{subtitle}</p>

              <div className="space-y-3">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-surface/40 border border-border/50 transition-all duration-300">
                    <span className="text-2xl">{feature.icon}</span>
                    <div className="text-left">
                      <div className="font-bold text-sm">{feature.title}</div>
                      <div className="text-xs text-text-secondary">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form Panel — slides between right ↔ left */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full transition-transform duration-600 ease-in-out z-20 ${isSignUp ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="h-full bg-surface flex flex-col justify-center items-center p-8 relative overflow-y-auto">
            <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10"></div>

            <div className="relative z-10 w-full max-w-md px-6">
              {/* Back Button */}
              {onBack && (
                <button
                  id="login-back-btn"
                  onClick={onBack}
                  className="flex items-center gap-2 text-text-secondary hover:text-text transition-colors mb-8"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Back
                </button>
              )}

              {/* Header */}
              <div className="mb-8">
                <h2 id="login-heading" className="text-3xl font-bold mb-2">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
                <p className="text-text-secondary">{isSignUp ? 'Join the competition today' : 'Sign in to continue your journey'}</p>
              </div>

              {/* Error */}
              {error && (
                <div id="login-error" className="mb-6 p-4 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
                  {error}
                </div>
              )}

              {/* Form */}
              <form id="login-form" onSubmit={handleEmailAuth} className="space-y-5">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                    autoComplete="email"
                    className="input"
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-text-secondary mb-2">Password</label>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    minLength="6"
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    className="input"
                  />
                </div>

                {!isSignUp && (
                  <div className="text-right">
                    <button
                      id="forgot-password-link"
                      type="button"
                      onClick={() => { setShowForgotPassword(true); setResetEmail(email); }}
                      className="text-sm text-accent hover:text-accent/80 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 text-base"
                >
                  {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center my-8">
                <div className="flex-1 border-t border-border"></div>
                <span className="px-4 text-text-muted text-sm">or continue with</span>
                <div className="flex-1 border-t border-border"></div>
              </div>

              {/* Social Buttons */}
              <div className="space-y-3">
                <button
                  id="google-signin-btn"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-lg bg-surface-elevated border border-border hover:border-accent/30 text-text font-medium transition-all hover:bg-surface-hover disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 40 40" fill="none">
                    <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" fill="white" />
                    <path d="M29.6 20.2273C29.6 19.5182 29.5364 18.8364 29.4182 18.1818H20V22.05H25.3818C25.15 23.3 24.4455 24.3591 23.3864 25.0682V27.5773H26.6182C28.5091 25.8364 29.6 23.2727 29.6 20.2273Z" fill="#4285F4" />
                    <path d="M20 30C22.7 30 24.9636 29.1045 26.6181 27.5773L23.3863 25.0682C22.4909 25.6682 21.3454 26.0227 20 26.0227C17.3954 26.0227 15.1909 24.2636 14.4045 21.9H11.0636V24.4909C12.7091 27.7591 16.0909 30 20 30Z" fill="#34A853" />
                    <path d="M14.4045 21.9C14.2045 21.3 14.0909 20.6591 14.0909 20C14.0909 19.3409 14.2045 18.7 14.4045 18.1V15.5091H11.0636C10.3864 16.8591 10 18.3864 10 20C10 21.6136 10.3864 23.1409 11.0636 24.4909L14.4045 21.9Z" fill="#FBBC04" />
                    <path d="M20 13.9773C21.4681 13.9773 22.7863 14.4818 23.8227 15.4727L26.6909 12.6045C24.9591 10.9909 22.6954 10 20 10C16.0909 10 12.7091 12.2409 11.0636 15.5091L14.4045 18.1C15.1909 15.7364 17.3954 13.9773 20 13.9773Z" fill="#E94235" />
                  </svg>
                  Continue with Google
                </button>

                <button
                  id="github-signin-btn"
                  onClick={handleGithubSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-lg bg-[#24292e] border border-[#2f333d] hover:bg-[#1b1f23] text-white font-medium transition-all disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Continue with GitHub
                </button>
              </div>

              {/* Toggle */}
              <div className="text-center mt-8 text-text-secondary">
                {isSignUp ? (
                  <>
                    Already have an account?{' '}
                    <button id="toggle-signin-btn" type="button" onClick={handleToggleMode} className="text-accent hover:text-accent/80 font-medium transition-colors">Sign In</button>
                  </>
                ) : (
                  <>
                    Don't have an account?{' '}
                    <button id="toggle-signup-btn" type="button" onClick={handleToggleMode} className="text-accent hover:text-accent/80 font-medium transition-colors">Create One</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====== MOBILE: Simple single-panel layout ====== */}
      <div className="md:hidden min-h-screen bg-surface flex flex-col justify-center items-center p-6 relative">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10"></div>

        <div className="relative z-10 w-full max-w-md">
          {/* Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-text-secondary hover:text-text transition-colors mb-8"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back
            </button>
          )}

          {/* Mobile Logo */}
          <div className="text-center mb-8">
            <img src={logo} alt="CodeDuelZ" className="w-16 h-16 mx-auto mb-3" />
            <h1 className="text-2xl font-black"><span className="text-gradient">CodeDuelZ</span></h1>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="text-text-secondary">{isSignUp ? 'Join the competition today' : 'Sign in to continue your journey'}</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
                autoComplete="email"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                minLength="6"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                className="input"
              />
            </div>

            {!isSignUp && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => { setShowForgotPassword(true); setResetEmail(email); }}
                  className="text-sm text-accent hover:text-accent/80 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base"
            >
              {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-border"></div>
            <span className="px-4 text-text-muted text-sm">or continue with</span>
            <div className="flex-1 border-t border-border"></div>
          </div>

          {/* Social Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-lg bg-surface-elevated border border-border hover:border-accent/30 text-text font-medium transition-all hover:bg-surface-hover disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 40 40" fill="none">
                <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" fill="white" />
                <path d="M29.6 20.2273C29.6 19.5182 29.5364 18.8364 29.4182 18.1818H20V22.05H25.3818C25.15 23.3 24.4455 24.3591 23.3864 25.0682V27.5773H26.6182C28.5091 25.8364 29.6 23.2727 29.6 20.2273Z" fill="#4285F4" />
                <path d="M20 30C22.7 30 24.9636 29.1045 26.6181 27.5773L23.3863 25.0682C22.4909 25.6682 21.3454 26.0227 20 26.0227C17.3954 26.0227 15.1909 24.2636 14.4045 21.9H11.0636V24.4909C12.7091 27.7591 16.0909 30 20 30Z" fill="#34A853" />
                <path d="M14.4045 21.9C14.2045 21.3 14.0909 20.6591 14.0909 20C14.0909 19.3409 14.2045 18.7 14.4045 18.1V15.5091H11.0636C10.3864 16.8591 10 18.3864 10 20C10 21.6136 10.3864 23.1409 11.0636 24.4909L14.4045 21.9Z" fill="#FBBC04" />
                <path d="M20 13.9773C21.4681 13.9773 22.7863 14.4818 23.8227 15.4727L26.6909 12.6045C24.9591 10.9909 22.6954 10 20 10C16.0909 10 12.7091 12.2409 11.0636 15.5091L14.4045 18.1C15.1909 15.7364 17.3954 13.9773 20 13.9773Z" fill="#E94235" />
              </svg>
              Continue with Google
            </button>

            <button
              onClick={handleGithubSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-lg bg-[#24292e] border border-[#2f333d] hover:bg-[#1b1f23] text-white font-medium transition-all disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Continue with GitHub
            </button>
          </div>

          {/* Toggle */}
          <div className="text-center mt-8 text-text-secondary">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <button type="button" onClick={handleToggleMode} className="text-accent hover:text-accent/80 font-medium transition-colors">Sign In</button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button type="button" onClick={handleToggleMode} className="text-accent hover:text-accent/80 font-medium transition-colors">Create One</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-elevated border border-border rounded-xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-2">Reset Password</h3>
            <p className="text-text-secondary mb-6">Enter your email and we'll send you a reset link.</p>
            {error && <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">{error}</div>}
            {resetSuccess && <div className="mb-4 p-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm">{resetSuccess}</div>}
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
                id="reset-email-input"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={loading}
                autoComplete="email"
                className="input"
              />
              <div className="flex gap-3">
                <button id="reset-cancel-btn" type="button" onClick={() => { setShowForgotPassword(false); setError(''); setResetSuccess(''); }} className="btn-secondary flex-1">Cancel</button>
                <button id="reset-submit-btn" type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Sending...' : 'Send Link'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
