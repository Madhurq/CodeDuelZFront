import { useState, useEffect, useRef } from 'react';
import { getNotifications, getUnreadCount, markNotificationRead, markAllNotificationsRead } from '../services/api';

const ICONS = {
    FRIEND_REQUEST: '🤝',
    FRIEND_ACCEPTED: '✅',
    CHALLENGE_RECEIVED: '⚔️',
    CHALLENGE_DECLINED: '❌',
    MATCH_RESULT: '🏆',
    SYSTEM: '📢',
};

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationBell({ newNotification, clearNewNotification, onNavigate }) {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const ref = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Fetch unread count on mount
    useEffect(() => {
        getUnreadCount().then(d => setUnreadCount(d.count)).catch(() => { });
    }, []);

    // Real-time push: bump count + prepend to list if loaded
    useEffect(() => {
        if (!newNotification) return;
        setUnreadCount(newNotification.unreadCount ?? (prev => prev + 1));
        if (loaded) {
            setNotifications(prev => [{
                id: Date.now(),
                type: newNotification.type,
                message: newNotification.message,
                fromUsername: newNotification.fromUsername,
                isRead: false,
                createdAt: new Date().toISOString(),
            }, ...prev].slice(0, 50));
        }
        clearNewNotification();
    }, [newNotification, loaded, clearNewNotification]);

    // Lazy-load full list when dropdown opens
    const handleOpen = async () => {
        setOpen(o => !o);
        if (!loaded) {
            try {
                const data = await getNotifications();
                setNotifications(data);
                setLoaded(true);
            } catch { /* ignored */ }
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch { /* ignored */ }
    };

    const handleClick = async (notif) => {
        if (!notif.isRead) {
            try {
                await markNotificationRead(notif.id);
                setUnreadCount(c => Math.max(0, c - 1));
                setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
            } catch { /* ignored */ }
        }
        // Navigate based on type
        if (notif.type === 'FRIEND_REQUEST' || notif.type === 'FRIEND_ACCEPTED') {
            onNavigate?.('friends');
        } else {
            onNavigate?.('home');
        }
        setOpen(false);
    };

    return (
        <div className="relative" ref={ref}>
            {/* Bell Button */}
            <button
                onClick={handleOpen}
                className="p-2.5 rounded-lg bg-surface-elevated border border-border hover:border-accent/30 text-text-secondary hover:text-accent transition-all relative"
                title="Notifications"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-error text-white text-[10px] font-bold px-1 animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-2 w-80 max-h-[420px] bg-surface-elevated border border-border rounded-xl shadow-2xl z-[200] flex flex-col overflow-hidden animate-fade-in">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                        <span className="font-bold text-sm">Notifications</span>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllRead} className="text-xs text-accent hover:underline">
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="overflow-y-auto flex-1">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-text-secondary text-sm">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <button
                                    key={n.id}
                                    onClick={() => handleClick(n)}
                                    className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-surface transition-colors border-b border-border/50 last:border-0 ${!n.isRead ? 'bg-accent/5' : ''}`}
                                >
                                    <span className="text-lg mt-0.5 shrink-0">{ICONS[n.type] || '📢'}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm leading-snug ${!n.isRead ? 'font-semibold text-text' : 'text-text-secondary'}`}>
                                            {n.message}
                                        </p>
                                        <p className="text-xs text-text-secondary mt-1">{timeAgo(n.createdAt)}</p>
                                    </div>
                                    {!n.isRead && (
                                        <span className="w-2 h-2 rounded-full bg-accent shrink-0 mt-2"></span>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
