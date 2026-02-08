import { Client } from '@stomp/stompjs';
import { useState, useEffect, useCallback, useRef } from 'react';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const wsBaseUrl = apiBaseUrl.replace(/^http/, 'ws');
const WS_URL = `${wsBaseUrl}/ws`;

export function useWebSocket(username) {
    const [connected, setConnected] = useState(false);
    const [matchData, setMatchData] = useState(null);
    const [matchResult, setMatchResult] = useState(null);
    const clientRef = useRef(null);

    useEffect(() => {
        if (!username) return;

        const client = new Client({
            brokerURL: WS_URL,
            reconnectDelay: 5000,
            debug: (str) => console.log('STOMP:', str),
            onConnect: () => {
                console.log('WebSocket connected for', username);
                setConnected(true);
                // Subscribe to personal topic (works without auth)
                client.subscribe(`/topic/user/${username}`, (msg) => {
                    console.log('Match found:', msg.body);
                    setMatchData(JSON.parse(msg.body));
                });
            },
            onDisconnect: () => setConnected(false),
            onStompError: (frame) => console.error('STOMP error:', frame),
        });

        client.activate();
        clientRef.current = client;

        return () => client.deactivate();
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

    const submitCode = useCallback((matchId, code, language) => {
        if (clientRef.current?.connected) {
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
        joinQueue,
        leaveQueue,
        subscribeToMatch,
        submitCode,
        clearMatchData: () => setMatchData(null),
        clearMatchResult: () => setMatchResult(null),
    };
}
