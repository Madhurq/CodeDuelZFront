export default function QuickStats({ stats }) {
  return (
    <div className="card">
      <h2 className="card-title">Quick Stats</h2>
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-value">{stats.matches}</div>
          <div className="stat-label">Total Matches</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{stats.wins}</div>
          <div className="stat-label">Wins</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{stats.rating}</div>
          <div className="stat-label">Rating</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{stats.winRate}%</div>
          <div className="stat-label">Win Rate</div>
        </div>
      </div>
    </div>
  );
}
