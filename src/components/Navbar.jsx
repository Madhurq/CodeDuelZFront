// src/components/Navbar.jsx
import logo from '../assets/logo.png';

export default function Navbar({ currentPage, onPageChange, user, onLogout }) {
  return (
    <nav className="sticky top-0 z-[100] w-full bg-white/95 backdrop-blur border-b border-border shadow-[0_4px_20px_rgba(0,0,0,0.08)] px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        <div className="flex items-center">
          <button
            onClick={() => onPageChange('home')}
            className="flex items-center gap-3 text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-primary to-secondary hover:scale-105 transition-all duration-300 focus:outline-none"
          >
            <div className="w-[60px] h-[60px] bg-white rounded-xl flex items-center justify-center text-white shadow-[0_4px_12px_rgba(59,130,246,0.3)]">
              <img src={logo} alt="Logo" className="w-10 h-10" />
            </div>
            CodeDuelZ
          </button>
        </div>

        <div className="hidden sm:flex gap-4">
          {['home', 'profile'].map((page) => (
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

        <div className="flex items-center text-sm text-text-secondary">
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
