import { useState, useEffect } from 'react';
import {
    getFriends,
    getPendingRequests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
} from '../services/api';

export default function Friends({ user, onStartMatch }) {
    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addFriendUsername, setAddFriendUsername] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [actionLoading, setActionLoading] = useState(null);

    // Load friends and pending requests
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [friendsData, requestsData] = await Promise.all([
                getFriends(),
                getPendingRequests(),
            ]);
            setFriends(friendsData || []);
            setPendingRequests(requestsData || []);
        } catch (error) {
            console.error('Error loading friends data:', error);
            showMessage('error', 'Failed to load friends data');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleSendRequest = async (e) => {
        e.preventDefault();
        if (!addFriendUsername.trim()) return;

        try {
            setActionLoading('send');
            await sendFriendRequest(addFriendUsername.trim());
            showMessage('success', `Friend request sent to ${addFriendUsername}`);
            setAddFriendUsername('');
        } catch (error) {
            console.error('Error sending friend request:', error);
            showMessage('error', 'Failed to send friend request. User may not exist.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            setActionLoading(`accept-${requestId}`);
            await acceptFriendRequest(requestId);
            showMessage('success', 'Friend request accepted!');
            await loadData();
        } catch (error) {
            console.error('Error accepting request:', error);
            showMessage('error', 'Failed to accept friend request');
        } finally {
            setActionLoading(null);
        }
    };

    const handleRejectRequest = async (requestId) => {
        try {
            setActionLoading(`reject-${requestId}`);
            await rejectFriendRequest(requestId);
            showMessage('success', 'Friend request rejected');
            await loadData();
        } catch (error) {
            console.error('Error rejecting request:', error);
            showMessage('error', 'Failed to reject friend request');
        } finally {
            setActionLoading(null);
        }
    };

    const handleRemoveFriend = async (friendId, username) => {
        if (!confirm(`Remove ${username} from friends?`)) return;

        try {
            setActionLoading(`remove-${friendId}`);
            await removeFriend(friendId);
            showMessage('success', `Removed ${username} from friends`);
            await loadData();
        } catch (error) {
            console.error('Error removing friend:', error);
            showMessage('error', 'Failed to remove friend');
        } finally {
            setActionLoading(null);
        }
    };

    const handleChallengeFriend = (friend) => {
        if (onStartMatch) {
            // Create a match with this friend
            onStartMatch({
                opponentId: friend.userId,
                opponentName: friend.username,
                difficulty: 'medium',
                language: 'cpp',
            });
        }
    };

    // Separate online and offline friends
    const onlineFriends = friends.filter((f) => f.isOnline);
    const offlineFriends = friends.filter((f) => !f.isOnline);

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-primary to-secondary mb-2">
                        👥 Friends
                    </h1>
                    <p className="text-text-secondary text-lg">
                        Connect with friends and challenge them to coding duels
                    </p>
                </div>

                {/* Message Toast */}
                {message.text && (
                    <div
                        className={`mb-6 p-4 rounded-lg border-l-4 ${message.type === 'success'
                                ? 'bg-green-500/10 border-green-500 text-green-400'
                                : 'bg-red-500/10 border-red-500 text-red-400'
                            } animate-[slideIn_0.3s_ease-out]`}
                    >
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Add Friend & Pending Requests */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Add Friend Section */}
                        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
                                <span className="text-2xl">➕</span> Add Friend
                            </h2>

                            <form onSubmit={handleSendRequest} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Enter username"
                                    value={addFriendUsername}
                                    onChange={(e) => setAddFriendUsername(e.target.value)}
                                    className="w-full p-3 border-2 border-border rounded-lg bg-selector text-text focus:border-primary focus:outline-none transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!addFriendUsername.trim() || actionLoading === 'send'}
                                    className="w-full p-3 rounded-lg bg-gradient-to-br from-primary to-secondary text-white font-bold hover:opacity-90 disabled:opacity-50 transition-all hover:scale-[1.02]"
                                >
                                    {actionLoading === 'send' ? '⏳ Sending...' : '📤 Send Request'}
                                </button>
                            </form>
                        </div>

                        {/* Pending Requests Section */}
                        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
                                <span className="text-2xl">📬</span> Pending Requests
                                {pendingRequests.length > 0 && (
                                    <span className="ml-auto text-sm px-3 py-1 rounded-full bg-primary/20 text-primary font-bold">
                                        {pendingRequests.length}
                                    </span>
                                )}
                            </h2>

                            {loading ? (
                                <div className="text-center py-8 text-text-secondary">
                                    <div className="animate-spin text-4xl mb-2">⏳</div>
                                    Loading...
                                </div>
                            ) : pendingRequests.length === 0 ? (
                                <div className="text-center py-8 text-text-secondary">
                                    <div className="text-4xl mb-2">📭</div>
                                    <p>No pending requests</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                    {pendingRequests.map((request) => (
                                        <div
                                            key={request.requestId}
                                            className="p-4 bg-surface-alt rounded-lg border border-border hover:border-primary transition-all"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <div className="font-bold text-text">{request.fromUsername}</div>
                                                    <div className="text-xs text-text-secondary">
                                                        {new Date(request.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleAcceptRequest(request.requestId)}
                                                    disabled={actionLoading === `accept-${request.requestId}`}
                                                    className="flex-1 px-3 py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30 font-semibold text-sm transition-all disabled:opacity-50"
                                                >
                                                    {actionLoading === `accept-${request.requestId}` ? '⏳' : '✓ Accept'}
                                                </button>
                                                <button
                                                    onClick={() => handleRejectRequest(request.requestId)}
                                                    disabled={actionLoading === `reject-${request.requestId}`}
                                                    className="flex-1 px-3 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 font-semibold text-sm transition-all disabled:opacity-50"
                                                >
                                                    {actionLoading === `reject-${request.requestId}` ? '⏳' : '✕ Reject'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Friends List */}
                    <div className="lg:col-span-2">
                        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <h2 className="text-2xl font-bold text-text mb-6 flex items-center gap-2">
                                <span className="text-2xl">🎮</span> My Friends
                                {friends.length > 0 && (
                                    <span className="ml-auto text-sm px-3 py-1 rounded-full bg-secondary/20 text-secondary font-bold">
                                        {onlineFriends.length} online • {friends.length} total
                                    </span>
                                )}
                            </h2>

                            {loading ? (
                                <div className="text-center py-16 text-text-secondary">
                                    <div className="animate-spin text-5xl mb-4">⏳</div>
                                    <p className="text-lg">Loading friends...</p>
                                </div>
                            ) : friends.length === 0 ? (
                                <div className="text-center py-16 text-text-secondary">
                                    <div className="text-6xl mb-4">👋</div>
                                    <p className="text-xl font-semibold mb-2">No friends yet</p>
                                    <p>Add friends to start challenging them to duels!</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Online Friends */}
                                    {onlineFriends.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-bold text-secondary mb-3 flex items-center gap-2">
                                                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                                                Online ({onlineFriends.length})
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {onlineFriends.map((friend) => (
                                                    <div
                                                        key={friend.friendId}
                                                        className="p-5 bg-gradient-to-br from-green-500/10 to-transparent rounded-xl border-2 border-green-500/30 hover:border-green-500 transition-all hover:scale-[1.02] hover:shadow-lg"
                                                    >
                                                        <div className="flex items-start justify-between mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                                                                    {friend.username.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-text text-lg">{friend.username}</div>
                                                                    <div className="flex items-center gap-1 text-green-400 text-sm font-semibold">
                                                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                                        Online
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleChallengeFriend(friend)}
                                                                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-br from-primary to-secondary text-white font-bold hover:opacity-90 transition-all text-sm"
                                                            >
                                                                ⚔️ Challenge
                                                            </button>
                                                            <button
                                                                onClick={() => handleRemoveFriend(friend.friendId, friend.username)}
                                                                disabled={actionLoading === `remove-${friend.friendId}`}
                                                                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 font-semibold text-sm transition-all disabled:opacity-50"
                                                            >
                                                                {actionLoading === `remove-${friend.friendId}` ? '⏳' : '🗑️'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Offline Friends */}
                                    {offlineFriends.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-bold text-text-secondary mb-3 flex items-center gap-2">
                                                <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                                                Offline ({offlineFriends.length})
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {offlineFriends.map((friend) => (
                                                    <div
                                                        key={friend.friendId}
                                                        className="p-5 bg-surface-alt rounded-xl border border-border hover:border-primary transition-all hover:scale-[1.02]"
                                                    >
                                                        <div className="flex items-start justify-between mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white font-bold text-xl opacity-70">
                                                                    {friend.username.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-text text-lg">{friend.username}</div>
                                                                    <div className="flex items-center gap-1 text-text-secondary text-sm">
                                                                        <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                                                                        Offline
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleChallengeFriend(friend)}
                                                                className="flex-1 px-4 py-2 rounded-lg bg-surface border-2 border-border text-text-secondary font-bold hover:border-primary hover:text-primary transition-all text-sm"
                                                            >
                                                                ⚔️ Challenge
                                                            </button>
                                                            <button
                                                                onClick={() => handleRemoveFriend(friend.friendId, friend.username)}
                                                                disabled={actionLoading === `remove-${friend.friendId}`}
                                                                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 font-semibold text-sm transition-all disabled:opacity-50"
                                                            >
                                                                {actionLoading === `remove-${friend.friendId}` ? '⏳' : '🗑️'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
