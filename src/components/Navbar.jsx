// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

// Sun icon for light mode
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
  </svg>
);

// Moon icon for dark mode
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
  </svg>
);

export default function Navbar({ currentPage, onPageChange, user, onLogout }) {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage or system preference on initial load
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add('dark'); //directly added through tailwindcss lib
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <nav className="top-0 z-[100] w-full bg-surface/95 backdrop-blur border-b border-border shadow-[0_4px_20px_rgba(0,0,0,0.08)] px-8 py-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        <div className="flex items-center">
          <button
            onClick={() => onPageChange('home')}
            className="flex items-center gap-3 text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-primary to-secondary hover:scale-105 transition-all duration-300 focus:outline-none"
          >
            <img src={logo} alt="Logo" className="w-20 h-20" />
            CodeDuelZ
          </button>
        </div>

        <div className="hidden sm:flex gap-4">
          {['home', 'leaderboard', 'profile'].map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`relative px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${currentPage === page
                ? 'text-primary bg-primary-light after:w-[60%]'
                : 'text-text-secondary hover:text-primary hover:bg-primary-light'
                } after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[3px] after:bg-gradient-to-r after:from-primary after:to-secondary after:rounded-sm after:transition-all after:duration-300 ${currentPage === page ? 'after:w-[60%]' : 'after:w-0 hover:after:w-[60%]'}`}
            >
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-text-secondary">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg bg-surface-alt border border-border hover:bg-primary-light hover:border-primary hover:text-primary transition-all duration-300 hover:-translate-y-0.5"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="font-bold text-text leading-none">
                  {user.email?.split('@')[0] || user.displayName || 'Player'}
                </span>
                <span className="text-xs">Online</span>
              </div>
              <button
                onClick={onLogout}
                className="px-6 py-2 border-2 border-border rounded-lg font-bold text-text bg-surface shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:bg-surface-alt hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <div>Not logged in</div>
          )}
        </div>
      </div>
    </nav>
  );
}

