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
            <div className="min-h-screen bg-background">
                <div className="max-w-[900px] mx-auto p-8">
                    <div className="text-center py-16 animate-pulse">
                        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <p className="text-lg text-text-secondary">Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-[900px] mx-auto p-8">
                    <div className="text-center py-16">
                        <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-error">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
                        <p className="text-lg text-error mb-6">{error || 'Profile not found'}</p>
                        <button
                            onClick={onBack}
                            className="btn-primary"
                        >
                            ← Back to Leaderboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const winRate = profile.wins + profile.losses > 0
        ? Math.round((profile.wins / (profile.wins + profile.losses)) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-background">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 max-w-[900px] mx-auto p-6 lg:p-8">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="mb-6 flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span className="text-sm font-semibold">Back to Leaderboard</span>
                </button>

                {/* Profile Card */}
                <div className="card overflow-hidden">
                    {/* Header Banner */}
                    <div className="h-32 bg-gradient-to-br from-accent to-tertiary relative">
                        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20"></div>
                        <div className="absolute -bottom-12 left-8">
                            <div className="w-24 h-24 rounded-2xl border-4 border-surface bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center text-white font-bold text-3xl shadow-lg overflow-hidden">
                                {profile.avatar ? (
                                    <img src={profile.avatar} alt={profile.userName} className="w-full h-full rounded-2xl object-cover" />
                                ) : (
                                    profile.userName?.charAt(0).toUpperCase() || '?'
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="pt-16 pb-8 px-8">
                        <h1 className="text-3xl font-extrabold text-text mb-1">{profile.userName || 'Unknown Player'}</h1>
                        <p className="text-text-muted text-sm mb-6">User ID: {profile.userId}</p>

                        {/* Bio */}
                        {profile.bio && (
                            <div className="mb-8 p-4 bg-surface-elevated rounded-lg border border-border">
                                <p className="text-text-secondary italic">"{profile.bio}"</p>
                            </div>
                        )}

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {[
                                { label: 'Rating', value: profile.rating || 1000, icon: '⭐', color: 'text-accent' },
                                { label: 'Wins', value: profile.wins || 0, icon: '🏆', color: 'text-success' },
                                { label: 'Losses', value: profile.losses || 0, icon: '💔', color: 'text-error' },
                                { label: 'Win Rate', value: `${winRate}%`, icon: '📊', color: 'text-tertiary' }
                            ].map((stat, index) => (
                                <div key={index} className="bg-surface-elevated border border-border rounded-xl p-4 text-center hover:border-accent/30 transition-all">
                                    <div className="text-2xl mb-1">{stat.icon}</div>
                                    <div className={`text-2xl font-extrabold ${stat.color}`}>
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-text-secondary font-semibold">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Win Rate Bar */}
                        <div className="mb-8">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-text-secondary">Win Rate</span>
                                <span className="font-medium">{winRate}%</span>
                            </div>
                            <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-success to-accent rounded-full transition-all duration-500"
                                    style={{ width: `${winRate}%` }}
                                ></div>
                            </div>
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
                                            className="flex items-center gap-3 p-4 bg-surface-elevated border border-border rounded-xl hover:border-accent/30 hover:-translate-y-1 transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-yellow-400/20 flex items-center justify-center text-yellow-400 font-bold text-sm">LC</div>
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
                                            className="flex items-center gap-3 p-4 bg-surface-elevated border border-border rounded-xl hover:border-accent/30 hover:-translate-y-1 transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-500 font-bold text-sm">CC</div>
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
                                            className="flex items-center gap-3 p-4 bg-surface-elevated border border-border rounded-xl hover:border-accent/30 hover:-translate-y-1 transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-sm">CF</div>
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
        </div>
    );
}
