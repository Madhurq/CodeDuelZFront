import { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/api';

// Trophy icon for top 3
const TrophyIcon = ({ rank }) => {
    const colors = {
        1: 'text-yellow-400',
        2: 'text-slate-400',
        3: 'text-amber-600'
    };

    return (
        <span className={`text-2xl ${colors[rank] || 'text-text-secondary'}`}>
            {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
        </span>
    );
};

export default function Leaderboard({ onViewProfile }) {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getLeaderboard();
                setLeaderboard(data);
            } catch (err) {
                console.error('Error fetching leaderboard:', err);
                setError('Failed to load leaderboard. Make sure the backend is running.');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <div className="max-w-[900px] mx-auto p-8">
                <div className="text-center py-16 animate-pulse">
                    <div className="text-5xl mb-4">🏆</div>
                    <p className="text-lg text-text-secondary">Loading leaderboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-[900px] mx-auto p-8">
                <div className="text-center py-16">
                    <div className="text-5xl mb-4">⚠️</div>
                    <p className="text-lg text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[900px] mx-auto p-8">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold mb-3 bg-clip-text text-text-secondary bg-gradient-to-br from-primary to-secondary">
                    🏆 Leaderboard
                </h1>
                <p className="text-text-secondary text-lg">Top players ranked by rating</p>
            </div>

            {/* Leaderboard Table */}
            {leaderboard.length === 0 ? (
                <div className="text-center py-16 bg-surface border-2 border-border rounded-xl">
                    <div className="text-5xl mb-4">📊</div>
                    <p className="text-lg text-text-secondary">No players on the leaderboard yet.</p>
                    <p className="text-sm text-text-secondary mt-2">Be the first to compete!</p>
                </div>
            ) : (
                <div className="bg-surface border-2 border-border rounded-xl overflow-hidden shadow-lg">
                    {/* Table Header */}
                    <div className="grid grid-cols-[80px_1fr_120px_120px] gap-4 px-6 py-4 bg-surface-alt border-b border-border font-semibold text-text-secondary text-sm">
                        <div>Rank</div>
                        <div>Player</div>
                        <div className="text-right">Rating</div>
                        <div className="text-center">Action</div>
                    </div>

                    {/* Table Body */}
                    {leaderboard.map((player, index) => (
                        <div
                            key={player.userId}
                            className={`grid grid-cols-[80px_1fr_120px_120px] gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-primary-light/50 border-b border-border last:border-b-0 ${index < 3 ? 'bg-gradient-to-r from-primary/5 to-transparent' : ''
                                }`}
                        >
                            {/* Rank */}
                            <div className="flex items-center justify-center">
                                <TrophyIcon rank={player.rank} />
                            </div>

                            {/* Player Info */}
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                                    {player.avatar ? (
                                        <img src={player.avatar} alt={player.userName} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        player.userName?.charAt(0).toUpperCase() || '?'
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <div className="font-bold text-text text-lg truncate">{player.userName || 'Unknown'}</div>
                                    <div className="text-sm text-text-secondary">ID: {player.userId}</div>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="text-right">
                                <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-primary to-secondary">
                                    {player.rating}
                                </span>
                            </div>

                            {/* View Profile Button */}
                            <div className="text-center">
                                <button
                                    onClick={() => onViewProfile(player.userId)}
                                    className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    View Profile
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
