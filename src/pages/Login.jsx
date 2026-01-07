// src/pages/Login.jsx
import { useState } from 'react';
import { auth } from '../config/firebase.js';
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

export default function Login() {
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
      setResetSuccess('Password reset email sent! Check your inbox if that account is registered.');
      setResetEmail('');
    } catch (err) {
      setError(err.message || 'Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Aesthetic Visual */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-center items-center p-12 relative overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-0"></div>

        <div className="relative z-10 max-w-lg text-center">
          <div className="text-5xl mb-6 bg-white/10 w-24 h-24 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.2)] mx-auto animate-bounce">
            ⚔️
          </div>
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">CodeDuelZ</h1>
          <p className="text-xl text-gray-400 mb-12 font-light">A 1V1 Coding Platform!!!</p>

          <div className="grid gap-6 text-left">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <span className="text-2xl">🎯</span>
              <div>
                <h3 className="font-bold text-white">Real-time Battles</h3>
                <p className="text-sm text-gray-400">Compete with <strong>CODERS</strong> worldwide</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <span className="text-2xl">📊</span>
              <div>
                <h3 className="font-bold text-white">Track Progress</h3>
                <p className="text-sm text-gray-400">Monitor your competitive stats</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <span className="text-2xl">🏆</span>
              <div>
                <h3 className="font-bold text-white">Climb Ranks</h3>
                <p className="text-sm text-gray-400">Rise through the leaderboards</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md bg-surface p-10 rounded-2xl shadow-xl border border-border">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-text mb-2">Welcome Back</h2>
            <p className="text-sm text-text-secondary">Sign in to continue your coding journey</p>
          </div>

          {error && <div className="bg-red-50 border-l-4 border-danger p-4 rounded-md mb-6 text-red-700 text-sm font-semibold">{error}</div>}

          <form onSubmit={handleEmailAuth} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-border rounded-lg text-base transition-all bg-[turquoise] focus:outline-none focus:border-primary focus:bg-[lightgreen] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] focus:-translate-y-px"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                minLength="6"
                className="w-full px-4 py-3 border-2 border-border rounded-lg text-base transition-all bg-[turquoise] focus:outline-none focus:border-primary focus:bg-[lightgreen] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] focus:-translate-y-px"
              />
            </div>

            {!isSignUp && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setResetEmail(email);
                    setError('');
                    setResetSuccess('');
                  }}
                  className="text-sm text-primary hover:underline hover:text-primary-dark transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-3.5 px-4 rounded-lg font-bold text-white bg-gradient-to-br from-primary to-secondary shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_24px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          {/* Forgot Password Modal */}
          {showForgotPassword && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-surface p-8 rounded-2xl shadow-xl border border-border max-w-md w-full">
                <h3 className="text-2xl font-bold text-text mb-4">Reset Password</h3>
                <p className="text-text-secondary mb-6">Enter your email address and we'll send you a link to reset your password (if you have an account).</p>

                {error && <div className="bg-red-50 border-l-4 border-danger p-4 rounded-md mb-4 text-red-700 text-sm font-semibold">{error}</div>}
                {resetSuccess && <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md mb-4 text-green-700 text-sm font-semibold">{resetSuccess}</div>}

                <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text">Email</label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 border-2 border-border rounded-lg text-base transition-all bg-[turquoise] focus:outline-none focus:border-primary focus:bg-[lightgreen] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] focus:-translate-y-px"
                    />
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setError('');
                        setResetSuccess('');
                      }}
                      className="flex-1 py-3 px-4 rounded-lg font-bold text-text bg-surface border-2 border-border hover:bg-surface-alt transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 px-4 rounded-lg font-bold text-white bg-gradient-to-br from-primary to-secondary shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_24px_rgba(59,130,246,0.4)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="flex items-center my-8 text-sm text-text-secondary before:flex-1 before:border-t before:border-border before:mr-4 after:flex-1 after:border-t after:border-border after:ml-4">
            <span>OR</span>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-border rounded-lg bg-surface text-text font-bold text-sm transition-all hover:bg-surface-alt hover:border-primary-dark hover:-translate-y-0.5 hover:shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 40 40" fill="none">
                <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" fill="white" />
                <g clipPath="url(#clip0_710_6217)">
                  <path d="M29.6 20.2273C29.6 19.5182 29.5364 18.8364 29.4182 18.1818H20V22.05H25.3818C25.15 23.3 24.4455 24.3591 23.3864 25.0682V27.5773H26.6182C28.5091 25.8364 29.6 23.2727 29.6 20.2273Z" fill="#4285F4" />
                  <path d="M20 30C22.7 30 24.9636 29.1045 26.6181 27.5773L23.3863 25.0682C22.4909 25.6682 21.3454 26.0227 20 26.0227C17.3954 26.0227 15.1909 24.2636 14.4045 21.9H11.0636V24.4909C12.7091 27.7591 16.0909 30 20 30Z" fill="#34A853" />
                  <path d="M14.4045 21.9C14.2045 21.3 14.0909 20.6591 14.0909 20C14.0909 19.3409 14.2045 18.7 14.4045 18.1V15.5091H11.0636C10.3864 16.8591 10 18.3864 10 20C10 21.6136 10.3864 23.1409 11.0636 24.4909L14.4045 21.9Z" fill="#FBBC04" />
                  <path d="M20 13.9773C21.4681 13.9773 22.7863 14.4818 23.8227 15.4727L26.6909 12.6045C24.9591 10.9909 22.6954 10 20 10C16.0909 10 12.7091 12.2409 11.0636 15.5091L14.4045 18.1C15.1909 15.7364 17.3954 13.9773 20 13.9773Z" fill="#E94235" />
                </g>
                <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="#747775" />
                <defs>
                  <clipPath id="clip0_710_6217">
                    <rect width="20" height="20" fill="white" transform="translate(10 10)" />
                  </clipPath>
                </defs>
              </svg>
              <span>Sign in with Google</span>
            </button>

            <button
              onClick={handleGithubSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-border rounded-lg bg-[#24292e] text-white font-bold text-sm transition-all hover:bg-black hover:-translate-y-0.5 hover:shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 40 40" fill="none">
                <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" fill="#24292e" />
                <path fillRule="evenodd" clipRule="evenodd" d="M20 10C14.477 10 10 14.477 10 20C10 24.418 12.865 28.166 16.839 29.489C17.339 29.579 17.521 29.272 17.521 29.007C17.521 28.772 17.512 28.149 17.508 27.311C14.726 27.909 14.139 26.091 14.139 26.091C13.685 24.947 13.029 24.641 13.029 24.641C12.121 24.027 13.098 24.039 13.098 24.039C14.101 24.11 14.629 25.057 14.629 25.057C15.521 26.573 16.97 26.132 17.539 25.876C17.631 25.231 17.889 24.791 18.175 24.541C15.955 24.289 13.62 23.445 13.62 19.736C13.62 18.654 14.009 17.771 14.649 17.078C14.546 16.825 14.203 15.843 14.747 14.487C14.747 14.487 15.586 14.218 17.497 15.492C18.294 15.271 19.147 15.16 20 15.157C20.853 15.16 21.706 15.271 22.503 15.492C24.414 14.218 25.253 14.487 25.253 14.487C25.797 15.843 25.454 16.825 25.351 17.078C25.991 17.771 26.38 18.654 26.38 19.736C26.38 23.455 24.041 24.286 21.814 24.533C22.172 24.843 22.491 25.457 22.491 26.391C22.491 27.734 22.48 28.813 22.48 29.007C22.48 29.274 22.66 29.584 23.168 29.488C27.137 28.162 30 24.416 30 20C30 14.477 25.523 10 20 10Z" fill="white" />
                <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="#24292e" />
              </svg>
              <span>Sign in with GitHub</span>
            </button>
          </div>

          <div className="text-center mt-6">
            {isSignUp ? (
              <p className="text-text-secondary">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="font-bold text-primary hover:underline hover:text-primary-dark transition-colors"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p className="text-text-secondary">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="font-bold text-primary hover:underline hover:text-primary-dark transition-colors"
                >
                  Create One
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
