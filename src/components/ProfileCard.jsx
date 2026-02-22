import { useRef } from 'react';

export default function ProfileCard({ profileData, onEditClick, onLogout, onAvatarChange }) {
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onAvatarChange) {
      onAvatarChange(file);
    }
    e.target.value = '';
  };

  const stats = [
    { label: 'Wins', value: profileData.wins, color: 'text-success' },
    { label: 'Losses', value: profileData.losses, color: 'text-error' },
    { label: 'Rating', value: profileData.rating, color: 'text-accent' },
    { label: 'Rank', value: profileData.rank || '-', color: 'text-gradient' },
  ];

  return (
    <div className="card p-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Avatar */}
      <div
        onClick={handleAvatarClick}
        className="relative w-24 h-24 mx-auto mb-6 group cursor-pointer"
      >
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center text-white text-4xl font-bold shadow-glow overflow-hidden">
          {profileData.avatar ? (
            <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            '👨‍💻'
          )}
        </div>
        <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
        </div>
      </div>

      <h2 className="text-xl font-bold text-center mb-1">{profileData.name}</h2>
      <p className="text-sm text-text-secondary text-center mb-4">{profileData.email}</p>

      {profileData.bio && (
        <p className="text-sm text-text-secondary text-center italic mb-6 px-2">
          "{profileData.bio}"
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="p-3 bg-surface-elevated rounded-lg text-center">
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-text-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button onClick={onEditClick} className="btn-primary w-full">
          Edit Profile
        </button>
        <button onClick={onLogout} className="btn-secondary w-full">
          Logout
        </button>
      </div>
    </div>
  );
}
