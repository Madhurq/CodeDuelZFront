export default function QuickStats({ stats, loading }) {
  return (
    <div className="card">
      <h2 className="card-title">📊 Your Performance {loading && <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>(updating...)</span>}</h2>
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-value">{stats.matches}</div>
          <div className="stat-label">Total Matches</div>
        </div>
        <div className="stat-box">
          <div className="stat-value" style={{ color: '#10b981' }}>{stats.wins}</div>
          <div className="stat-label">Wins</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{stats.rating}</div>
          <div className="stat-label">Rating</div>
        </div>
        <div className="stat-box">
          <div className="stat-value" style={{ color: stats.winRate >= 50 ? '#10b981' : '#ef4444' }}>{stats.winRate}%</div>
          <div className="stat-label">Win Rate</div>
        </div>
      </div>
    </div>
  );
}
