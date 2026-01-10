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
    // Reset the input so the same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="bg-surface border-2 border-border rounded-xl p-8 h-fit shadow-md relative overflow-hidden group transition-colors duration-300">
      {/* Hidden file input for avatar upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Background gradient effect */}
      <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-br from-primary to-secondary opacity-10 z-0"></div>

      <div
        onClick={handleAvatarClick}
        className="w-[110px] h-[110px] rounded-xl flex items-center justify-center text-[3rem] shadow-[0_8px_24px_rgba(59,130,246,0.3)] bg-gradient-to-br from-primary to-secondary text-white relative z-10 mx-auto mb-6 transition-all duration-300 cursor-pointer hover:scale-105 hover:rotate-3 hover:shadow-[0_12px_32px_rgba(59,130,246,0.4)] overflow-hidden"
        title="Click to change avatar"
      >
        {profileData.avatar ? (
          <img
            src={profileData.avatar}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          '👨‍💻'
        )}
        {/* Hover overlay with camera icon */}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-2xl">📷</span>
        </div>
      </div>
      <h2 className="text-xl font-bold text-center mb-2 text-text">{profileData.name}</h2>
      <p className="text-[0.9rem] text-center text-text-secondary mb-2">{profileData.email}</p>

      {/* Bio display */}
      {profileData.bio && (
        <p className="text-[0.85rem] text-center text-text-secondary italic mb-6 px-2 line-clamp-3">
          "{profileData.bio}"
        </p>
      )}
      {!profileData.bio && <div className="mb-6"></div>}

      <div className="flex flex-col gap-4 mb-6 pb-6 border-b border-border">
        {[
          { label: 'Wins', value: profileData.wins },
          { label: 'Losses', value: profileData.losses },
          { label: 'Rating', value: profileData.rating },
          { label: 'Rank', value: profileData.rank }
        ].map((stat) => (
          <div key={stat.label} className="flex justify-between">
            <span className="text-[0.9rem] text-text-secondary">{stat.label}</span>
            <span className="font-bold text-primary">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <button
          className="w-full py-3.5 rounded-lg border-none font-bold text-[0.95rem] cursor-pointer transition-all relative overflow-hidden bg-gradient-to-br from-primary to-secondary text-white shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(59,130,246,0.4)] active:-translate-y-px"
          onClick={onEditClick}
        >
          Edit Profile
        </button>
        <button
          className="w-full py-3.5 rounded-lg border-2 border-border font-bold text-[0.95rem] cursor-pointer transition-all bg-surface text-text shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:bg-surface-alt hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

