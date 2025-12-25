// src/components/Navbar.jsx
export default function Navbar({ currentPage, onPageChange, user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <button
          className="navbar-logo"
          onClick={() => onPageChange('home')}
        >
          <img className="logo-icon" src="/src/assets/logo.png" alt="Logo" />
        </button>

        <ul className="navbar-nav">
          <li>
            <button
              className={
                'nav-link' + (currentPage === 'home' ? ' active' : '')
              }
              onClick={() => onPageChange('home')}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className={
                'nav-link' + (currentPage === 'profile' ? ' active' : '')
              }
              onClick={() => onPageChange('profile')}
            >
              Profile
            </button>
          </li>
        </ul>

        {user && (
          <div className="navbar-user">
            <span style={{ marginRight: '1rem' }}>
              {user.email || user.displayName || 'Player'}
            </span>
            <button 
              onClick={onLogout}
              style={{
                background: 'var(--danger)',
                color: 'white',
                border: 'none',
                padding: '0.4rem 0.8rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}