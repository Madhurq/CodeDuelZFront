import { Client } from '@stomp/stompjs';
import { useState, useEffect, useCallback, useRef } from 'react';
import { getBaseUrl } from '../services/api';

export function useWebSocket(username) {
    const [connected, setConnected] = useState(false);
    const [matchData, setMatchData] = useState(null);
    const [matchResult, setMatchResult] = useState(null);
    const [runResult, setRunResult] = useState(null);
    const [submitResult, setSubmitResult] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [challengeRequest, setChallengeRequest] = useState(null);   // incoming: { fromUsername }
    const [challengeResponse, setChallengeResponse] = useState(null); // outgoing response: { type, byUsername }
    const clientRef = useRef(null);

    useEffect(() => {
        if (!username) return;
        let cancelled = false;

        async function connect() {
            const apiBaseUrl = await getBaseUrl();
            if (cancelled) return;

            const wsBaseUrl = apiBaseUrl.replace(/^http/, 'ws');
            const WS_URL = `${wsBaseUrl}/ws`;
            console.log('WebSocket connecting to:', WS_URL);

            const client = new Client({
                brokerURL: WS_URL,
                reconnectDelay: 5000,
                debug: (str) => console.log('STOMP:', str),
                onConnect: () => {
                    console.log('WebSocket connected for', username);
                    setConnected(true);

                    // Announce presence so friends list shows this user as online
                    client.publish({
                        destination: '/app/user/online',
                        body: JSON.stringify({ username }),
                    });

                    // Subscribe to match found events (normal matchmaking + accepted challenges)
                    client.subscribe(`/topic/user/${username}`, (msg) => {
                        console.log('Match found:', msg.body);
                        setMatchData(JSON.parse(msg.body));
                    });

                    // Subscribe to challenge events (incoming request or response to our request)
                    client.subscribe(`/topic/user/${username}/challenge`, (msg) => {
                        const data = JSON.parse(msg.body);
                        console.log('Challenge event:', data);
                        if (data.type === 'CHALLENGE_REQUEST') {
                            setChallengeRequest(data); // show modal to this user
                        } else if (data.type === 'CHALLENGE_DECLINED') {
                            setChallengeResponse(data); // notify challenger it was declined
                        }
                    });

                    // Subscribe to run results (▶ Run button)
                    client.subscribe(`/topic/user/${username}/run-result`, (msg) => {
                        console.log('Run result:', msg.body);
                        setRunResult(JSON.parse(msg.body));
                        setIsRunning(false);
                    });

                    // Subscribe to submit results (🚀 Submit button)
                    client.subscribe(`/topic/user/${username}/submit-result`, (msg) => {
                        console.log('Submit result:', msg.body);
                        setSubmitResult(JSON.parse(msg.body));
                        setIsSubmitting(false);
                    });
                },
                onDisconnect: () => setConnected(false),
                onStompError: (frame) => console.error('STOMP error:', frame),
            });

            client.activate();
            clientRef.current = client;
        }

        connect();

        return () => {
            cancelled = true;
            // Clean deactivate — no reconnect on unmount
            if (clientRef.current) {
                clientRef.current.reconnectDelay = 0;  // disable auto-reconnect
                clientRef.current.deactivate();
            }
        };
    }, [username]);

    const joinQueue = useCallback((difficulty) => {
        if (clientRef.current?.connected) {
            clientRef.current.publish({
                destination: '/app/queue/join',
                body: JSON.stringify({ username, difficulty: difficulty.toUpperCase() }),
            });
        }
    }, [username]);

    const leaveQueue = useCallback(() => {
        if (clientRef.current?.connected) {
            clientRef.current.publish({
                destination: '/app/queue/leave',
                body: JSON.stringify({ username }),
            });
        }
    }, [username]);

    const sendChallenge = useCallback((toUsername) => {
        if (clientRef.current?.connected) {
            clientRef.current.publish({
                destination: '/app/challenge/send',
                body: JSON.stringify({ fromUsername: username, toUsername }),
            });
        }
    }, [username]);

    const respondChallenge = useCallback((fromUsername, accepted, difficulty) => {
        if (clientRef.current?.connected) {
            clientRef.current.publish({
                destination: '/app/challenge/respond',
                body: JSON.stringify({ fromUsername, toUsername: username, accepted: String(accepted), difficulty }),
            });
        }
    }, [username]);

    const subscribeToMatch = useCallback((matchId) => {
        if (clientRef.current?.connected) {
            clientRef.current.subscribe(`/topic/match/${matchId}`, (msg) => {
                setMatchResult(JSON.parse(msg.body));
            });
        }
    }, []);

    const runCode = useCallback((matchId, code, language) => {
        if (clientRef.current?.connected) {
            setIsRunning(true);
            setRunResult(null);
            clientRef.current.publish({
                destination: '/app/match/run',
                body: JSON.stringify({ username, matchId, code, language }),
            });
        }
    }, [username]);

    const submitCode = useCallback((matchId, code, language) => {
        if (clientRef.current?.connected) {
            setIsSubmitting(true);
            setSubmitResult(null);
            clientRef.current.publish({
                destination: '/app/match/submit',
                body: JSON.stringify({ username, matchId, code, language }),
            });
        }
    }, [username]);

    // Explicit offline — call this before logout or closing app
    const goOffline = useCallback(() => {
        const client = clientRef.current;
        if (client?.connected) {
            client.publish({
                destination: '/app/user/offline',
                body: JSON.stringify({ username }),
            });
            client.reconnectDelay = 0;  // don't reconnect after this
            client.deactivate();
        }
    }, [username]);

    // Mark offline if user closes/refreshes the browser tab
    useEffect(() => {
        const handleUnload = () => {
            const client = clientRef.current;
            if (client?.connected && username) {
                // sendBeacon is fire-and-forget — works even on tab close
                // Fallback: just deactivate (triggers SessionDisconnectEvent)
                client.reconnectDelay = 0;
                client.deactivate();
            }
        };
        window.addEventListener('beforeunload', handleUnload);
        return () => window.removeEventListener('beforeunload', handleUnload);
    }, [username]);

    return {
        connected,
        matchData,
        matchResult,
        runResult,
        submitResult,
        isRunning,
        isSubmitting,
        challengeRequest,
        challengeResponse,
        joinQueue,
        leaveQueue,
        sendChallenge,
        respondChallenge,
        subscribeToMatch,
        runCode,
        submitCode,
        goOffline,
        clearMatchData: () => setMatchData(null),
        clearMatchResult: () => setMatchResult(null),
        clearRunResult: () => setRunResult(null),
        clearSubmitResult: () => setSubmitResult(null),
        clearChallengeRequest: () => setChallengeRequest(null),
        clearChallengeResponse: () => setChallengeResponse(null),
    };
}
