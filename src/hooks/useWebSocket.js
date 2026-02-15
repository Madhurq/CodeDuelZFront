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

                    // Subscribe to match found events
                    client.subscribe(`/topic/user/${username}`, (msg) => {
                        console.log('Match found:', msg.body);
                        setMatchData(JSON.parse(msg.body));
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
            clientRef.current?.deactivate();
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

    return {
        connected,
        matchData,
        matchResult,
        runResult,
        submitResult,
        isRunning,
        isSubmitting,
        joinQueue,
        leaveQueue,
        subscribeToMatch,
        runCode,
        submitCode,
        clearMatchData: () => setMatchData(null),
        clearMatchResult: () => setMatchResult(null),
        clearRunResult: () => setRunResult(null),
        clearSubmitResult: () => setSubmitResult(null),
    };
}
