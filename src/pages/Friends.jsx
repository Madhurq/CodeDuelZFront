import { useState, useEffect } from 'react';
import {
  getFriends,
  getPendingRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
} from '../services/api';

export default function Friends({ user, onStartMatch, wsSendChallenge, wsMatchData, wsClearMatchData }) {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addFriendUsername, setAddFriendUsername] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [actionLoading, setActionLoading] = useState(null);
  const [pendingChallenge, setPendingChallenge] = useState(null); // username we challenged

  useEffect(() => {
    loadData();
  }, []);

  // When match data arrives (challenge accepted), navigate to arena
  useEffect(() => {
    if (wsMatchData && onStartMatch) {
      onStartMatch(wsMatchData);
      if (wsClearMatchData) wsClearMatchData();
      setPendingChallenge(null);
    }
  }, [wsMatchData, onStartMatch, wsClearMatchData]);

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
      showMessage('error', 'Failed to send friend request');
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
      showMessage('error', 'Failed to accept request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      setActionLoading(`reject-${requestId}`);
      await rejectFriendRequest(requestId);
      showMessage('success', 'Request rejected');
      await loadData();
    } catch (error) {
      console.error('Error rejecting request:', error);
      showMessage('error', 'Failed to reject request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveFriend = async (friendId, username) => {
    if (!confirm(`Remove ${username} from friends?`)) return;
    try {
      setActionLoading(`remove-${friendId}`);
      await removeFriend(friendId);
      showMessage('success', `Removed ${username}`);
      await loadData();
    } catch (error) {
      console.error('Error removing friend:', error);
      showMessage('error', 'Failed to remove friend');
    } finally {
      setActionLoading(null);
    }
  };

  const handleChallengeFriend = (friend) => {
    if (wsSendChallenge) {
      wsSendChallenge(friend.username);
      setPendingChallenge(friend.username);
      showMessage('success', `Challenge sent to ${friend.username}! Waiting for response...`);
    }
  };

  const onlineFriends = friends.filter((f) => f.isOnline);
  const offlineFriends = friends.filter((f) => !f.isOnline);

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">
            Friends <span className="text-gradient">&</span> Rivals
          </h1>
          <p className="text-text-secondary text-lg">
            Connect with developers and challenge them to battles
          </p>
        </div>

        {/* Toast Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 ${message.type === 'success'
              ? 'bg-success/10 border-success text-success'
              : 'bg-error/10 border-error text-error'
            }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Add Friend */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                </div>
                <h2 className="text-lg font-bold">Add Friend</h2>
              </div>

              <form onSubmit={handleSendRequest} className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter username"
                  value={addFriendUsername}
                  onChange={(e) => setAddFriendUsername(e.target.value)}
                  className="input"
                />
                <button
                  type="submit"
                  disabled={!addFriendUsername.trim() || actionLoading === 'send'}
                  className="btn-primary w-full"
                >
                  {actionLoading === 'send' ? 'Sending...' : 'Send Request'}
                </button>
              </form>
            </div>

            {/* Pending Requests */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold">Requests</h2>
                </div>
                {pendingRequests.length > 0 && (
                  <span className="px-2 py-1 rounded-full bg-warning/20 text-warning text-xs font-bold">
                    {pendingRequests.length}
                  </span>
                )}
              </div>

              {loading ? (
                <div className="text-center py-8 text-text-muted">Loading...</div>
              ) : pendingRequests.length === 0 ? (
                <div className="text-center py-8 text-text-muted text-sm">
                  No pending requests
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {pendingRequests.map((request) => (
                    <div key={request.requestId} className="p-3 bg-surface-elevated rounded-lg">
                      <div className="font-medium mb-2">{request.fromUsername}</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptRequest(request.requestId)}
                          disabled={actionLoading === `accept-${request.requestId}`}
                          className="flex-1 py-2 rounded-lg bg-success/10 text-success border border-success/30 hover:bg-success/20 text-sm font-medium transition-all"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.requestId)}
                          disabled={actionLoading === `reject-${request.requestId}`}
                          className="flex-1 py-2 rounded-lg bg-error/10 text-error border border-error/30 hover:bg-error/20 text-sm font-medium transition-all"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Friends List */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold">My Friends</h2>
                </div>
                {friends.length > 0 && (
                  <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                    {onlineFriends.length} online
                  </span>
                )}
              </div>

              {loading ? (
                <div className="text-center py-16">
                  <div className="w-12 h-12 rounded-full bg-surface-elevated animate-pulse mx-auto mb-4"></div>
                  <p className="text-text-muted">Loading friends...</p>
                </div>
              ) : friends.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <p className="text-xl font-medium mb-2">No friends yet</p>
                  <p className="text-text-secondary text-sm">Add friends to challenge them!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {onlineFriends.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-success mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                        Online ({onlineFriends.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {onlineFriends.map((friend) => (
                          <div key={friend.friendId} className="p-4 bg-success/5 border border-success/20 rounded-xl hover:border-success/40 transition-all">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center text-white font-bold">
                                {friend.username.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{friend.username}</div>
                                <div className="text-xs text-success flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></span>
                                  Online
                                </div>
                              </div>
                            </div>
                            {pendingChallenge === friend.username ? (
                              <button
                                disabled
                                className="w-full py-2 rounded-lg bg-accent/20 text-accent border border-accent/40 font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                              >
                                <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                                Waiting...
                              </button>
                            ) : (
                              <button
                                onClick={() => handleChallengeFriend(friend)}
                                className="w-full py-2 rounded-lg bg-accent text-black font-medium hover:shadow-glow transition-all text-sm"
                              >
                                ⚡ Challenge
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {offlineFriends.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-text-muted mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-text-muted rounded-full"></span>
                        Offline ({offlineFriends.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {offlineFriends.map((friend) => (
                          <div key={friend.friendId} className="p-4 bg-surface-elevated border border-border rounded-xl hover:border-border-light transition-all">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-lg bg-surface-hover flex items-center justify-center text-text-muted font-bold">
                                {friend.username.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{friend.username}</div>
                                <div className="text-xs text-text-muted">Offline</div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleChallengeFriend(friend)}
                              className="w-full py-2 rounded-lg bg-surface border border-border text-text-secondary font-medium hover:border-accent hover:text-accent transition-all text-sm"
                            >
                              Challenge
                            </button>
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
