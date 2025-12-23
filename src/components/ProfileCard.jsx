export default function ProfileCard({ profileData, onEditClick, onLogout }) {
  return (
    <div className="profile-card">
      <div className="profile-avatar">👨‍💻</div>
      <h2 className="profile-name">{profileData.name}</h2>
      <p className="profile-username">{profileData.email}</p>

      <div className="profile-stats">
        <div className="profile-stat">
          <span className="profile-stat-label">Wins</span>
          <span className="profile-stat-value">{profileData.wins}</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-label">Losses</span>
          <span className="profile-stat-value">{profileData.losses}</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-label">Rating</span>
          <span className="profile-stat-value">{profileData.rating}</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-label">Rank</span>
          <span className="profile-stat-value">{profileData.rank}</span>
        </div>
      </div>

      <div className="profile-actions">
        <button className="btn btn-primary" onClick={onEditClick}>
          Edit Profile
        </button>
        <button className="btn btn-secondary" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
