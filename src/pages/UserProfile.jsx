import { useState, useEffect } from 'react';
import { getPublicProfile } from '../services/api';

export default function UserProfile({ userId, onBack }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getPublicProfile(userId);
                setProfile(data);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Failed to load profile. User may not exist.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    if (loading) {
        return (
            <div className="max-w-[900px] mx-auto p-8">
                <div className="text-center py-16 animate-pulse">
                    <div className="text-5xl mb-4">👤</div>
                    <p className="text-lg text-text-secondary">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="max-w-[900px] mx-auto p-8">
                <div className="text-center py-16">
                    <div className="text-5xl mb-4">⚠️</div>
                    <p className="text-lg text-red-500">{error || 'Profile not found'}</p>
                    <button
                        onClick={onBack}
                        className="mt-6 px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all"
                    >
                        ← Back to Leaderboard
                    </button>
                </div>
            </div>
        );
    }

    const winRate = profile.wins + profile.losses > 0
        ? Math.round((profile.wins / (profile.wins + profile.losses)) * 100)
        : 0;

    return (
        <div className="max-w-[900px] mx-auto p-8">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="mb-6 px-4 py-2 text-sm font-semibold text-text-secondary hover:text-primary transition-all flex items-center gap-2"
            >
                <span>←</span> Back to Leaderboard
            </button>

            {/* Profile Card */}
            <div className="bg-surface border-2 border-border rounded-xl overflow-hidden shadow-lg">
                {/* Header Banner */}
                <div className="h-32 bg-gradient-to-br from-primary to-secondary relative">
                    <div className="absolute -bottom-12 left-8">
                        <div className="w-24 h-24 rounded-full border-4 border-surface bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                            {profile.avatar ? (
                                <img src={profile.avatar} alt={profile.userName} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                profile.userName?.charAt(0).toUpperCase() || '?'
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Info */}
                <div className="pt-16 pb-8 px-8">
                    <h1 className="text-3xl font-extrabold text-text mb-1">{profile.userName || 'Unknown Player'}</h1>
                    <p className="text-text-secondary mb-6">User ID: {profile.userId}</p>

                    {/* Bio */}
                    {profile.bio && (
                        <div className="mb-8 p-4 bg-surface-alt rounded-lg border border-border">
                            <p className="text-text italic">"{profile.bio}"</p>
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Rating', value: profile.rating || 1000, icon: '⭐' },
                            { label: 'Wins', value: profile.wins || 0, icon: '🏆' },
                            { label: 'Losses', value: profile.losses || 0, icon: '💔' },
                            { label: 'Win Rate', value: `${winRate}%`, icon: '📊' }
                        ].map((stat, index) => (
                            <div key={index} className="bg-surface-alt border border-border rounded-xl p-4 text-center hover:border-primary transition-all">
                                <div className="text-2xl mb-1">{stat.icon}</div>
                                <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-primary to-secondary">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-text-secondary font-semibold">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Competitive Profiles */}
                    {(profile.leetcodeUsername || profile.codechefUsername || profile.codeforcesHandle) && (
                        <div>
                            <h3 className="text-lg font-bold text-text mb-4">Competitive Profiles</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {profile.leetcodeUsername && (
                                    <a
                                        href={`https://leetcode.com/${profile.leetcodeUsername}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-4 bg-surface-alt border border-border rounded-xl hover:border-primary hover:-translate-y-1 transition-all"
                                    >
                                        <span className="text-2xl">💻</span>
                                        <div>
                                            <div className="font-semibold text-text">LeetCode</div>
                                            <div className="text-sm text-text-secondary">{profile.leetcodeUsername}</div>
                                        </div>
                                    </a>
                                )}
                                {profile.codechefUsername && (
                                    <a
                                        href={`https://www.codechef.com/users/${profile.codechefUsername}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-4 bg-surface-alt border border-border rounded-xl hover:border-primary hover:-translate-y-1 transition-all"
                                    >
                                        <span className="text-2xl">👨‍🍳</span>
                                        <div>
                                            <div className="font-semibold text-text">CodeChef</div>
                                            <div className="text-sm text-text-secondary">{profile.codechefUsername}</div>
                                        </div>
                                    </a>
                                )}
                                {profile.codeforcesHandle && (
                                    <a
                                        href={`https://codeforces.com/profile/${profile.codeforcesHandle}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-4 bg-surface-alt border border-border rounded-xl hover:border-primary hover:-translate-y-1 transition-all"
                                    >
                                        <span className="text-2xl">⚡</span>
                                        <div>
                                            <div className="font-semibold text-text">Codeforces</div>
                                            <div className="text-sm text-text-secondary">{profile.codeforcesHandle}</div>
                                        </div>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
