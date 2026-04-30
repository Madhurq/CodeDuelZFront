import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWS } from '../contexts/WebSocketContext';
import Navbar from '../components/Navbar';
import ChallengeModal from '../components/ChallengeModal';

export default function ProtectedLayout() {
  const { user, loading } = useAuth();
  const { challengeRequest, handleAcceptChallenge, handleDeclineChallenge, declinedToast } = useWS();
  const location = useLocation();

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

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const isMatchArena = location.pathname.startsWith('/match');

  return (
    <>
      {/* Global challenge modal (shown on any page) */}
      <ChallengeModal
        challengeRequest={challengeRequest}
        onAccept={handleAcceptChallenge}
        onDecline={handleDeclineChallenge}
      />

      {/* Declined toast */}
      {declinedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[150] px-6 py-3 rounded-xl bg-error/20 border border-error/40 text-error font-medium shadow-lg animate-fade-in">
          {declinedToast}
        </div>
      )}

      {!isMatchArena && <Navbar />}

      <div className="transition-all duration-200 opacity-100 translate-y-0">
        <Outlet />
      </div>
    </>
  );
}
