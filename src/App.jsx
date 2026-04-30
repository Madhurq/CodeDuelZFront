// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import PublicLayout from './layouts/PublicLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import UserProfile from './pages/UserProfile';
import MatchArena from './pages/MatchArena';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Friends from './pages/Friends';

function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <Routes>
          {/* Public routes — redirect to /home if already logged in */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected routes — redirect to / if not logged in */}
          <Route element={<ProtectedLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/user/:userId" element={<UserProfile />} />
            <Route path="/match" element={<MatchArena />} />
          </Route>

          {/* Catch-all — redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </WebSocketProvider>
    </AuthProvider>
  );
}

export default App;
