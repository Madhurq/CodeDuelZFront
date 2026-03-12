import { useState, useEffect, useRef } from 'react';
import { searchUsers } from '../services/api';

export default function FindPlayersSearch({ onViewProfile }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const ref = useRef(null);
    const searchTimeoutRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
                setQuery('');
                setResults([]);
            }
        };
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setOpen(false);
                setQuery('');
                setResults([]);
            }
        };
        document.addEventListener('mousedown', handler);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('keydown', handleKeyDown);
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

        if (!query.trim() || query.trim().length < 2) {
            setResults([]);
            return;
        }

        searchTimeoutRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const users = await searchUsers(query);
                setResults(users);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        };
    }, [query]);

    const handleSelectUser = (userId) => {
        if (onViewProfile) {
            onViewProfile(userId);
        }
        setOpen(false);
        setQuery('');
        setResults([]);
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="p-2.5 rounded-lg bg-surface-elevated border border-border hover:border-accent/30 text-text-secondary hover:text-accent transition-all"
                title="Find Players"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </button>

            {open && (
                <div className="absolute right-0 top-12 w-80 bg-surface-elevated border border-border rounded-xl shadow-xl z-[150] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-border">
                        <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search players..."
                                className="w-full pl-9 pr-16 py-2.5 bg-background border border-border rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
                                autoFocus
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                {loading && (
                                    <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                                )}
                                {!loading && query && (
                                    <button
                                        onClick={() => setQuery('')}
                                        className="text-text-muted hover:text-text transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 6 6 18"></path>
                                            <path d="m6 6 12 12"></path>
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {results.length === 0 && query.trim().length >= 2 && !loading && (
                            <div className="p-4 text-center text-text-muted text-sm">
                                No players found
                            </div>
                        )}

                        {results.length === 0 && query.trim().length < 2 && (
                            <div className="p-4 text-center text-text-muted text-sm">
                                Type at least 2 characters
                            </div>
                        )}

                        {results.map((user) => (
                            <button
                                key={user.userId}
                                onClick={() => handleSelectUser(user.userId)}
                                className="w-full p-3 flex items-center gap-3 hover:bg-background/50 transition-colors text-left border-b border-border/50 last:border-b-0"
                            >
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="" className="w-full h-full rounded-lg object-cover" />
                                    ) : (
                                        <span className="text-lg">👨‍💻</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-text truncate">{user.userName}</div>
                                    <div className="text-xs text-text-muted truncate">{user.email}</div>
                                </div>
                                {user.rating && (
                                    <div className="text-sm font-bold text-accent">#{user.rating}</div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-2 border-t border-border bg-background/30">
                        <div className="text-xs text-text-muted text-center">
                            Press <kbd className="px-1.5 py-0.5 bg-surface-elevated rounded text-text-secondary">ESC</kbd> to close
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
