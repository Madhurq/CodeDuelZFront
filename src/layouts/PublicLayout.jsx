import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PublicLayout() {
  const { user, loading } = useAuth();

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

  // Already logged in — redirect to dashboard
  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
