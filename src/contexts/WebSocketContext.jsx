import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const { dbUser } = useAuth();
  const username = dbUser?.userName || null;

  const ws = useWebSocket(username);

  const [declinedToast, setDeclinedToast] = useState('');

  // When challenged user's response arrives (CHALLENGE_DECLINED), show a toast
  useEffect(() => {
    if (ws.challengeResponse?.type === 'CHALLENGE_DECLINED') {
      setDeclinedToast(`${ws.challengeResponse.byUsername} declined your challenge`);
      ws.clearChallengeResponse();
      setTimeout(() => setDeclinedToast(''), 4000);
    }
  }, [ws.challengeResponse, ws.clearChallengeResponse]);

  // Accept incoming challenge: respond via WS; match data will arrive via /topic/user/{username}
  const handleAcceptChallenge = useCallback((difficulty) => {
    if (ws.challengeRequest) {
      ws.respondChallenge(ws.challengeRequest.fromUsername, true, difficulty);
      ws.clearChallengeRequest();
    }
  }, [ws.challengeRequest, ws.respondChallenge, ws.clearChallengeRequest]);

  const handleDeclineChallenge = useCallback(() => {
    if (ws.challengeRequest) {
      ws.respondChallenge(ws.challengeRequest.fromUsername, false, 'medium');
      ws.clearChallengeRequest();
    }
  }, [ws.challengeRequest, ws.respondChallenge, ws.clearChallengeRequest]);

  return (
    <WebSocketContext.Provider value={{
      ...ws,
      declinedToast,
      handleAcceptChallenge,
      handleDeclineChallenge,
    }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWS() {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error('useWS must be used within WebSocketProvider');
  return context;
}
