export default function QuickStats({ stats, loading }) {
  const statCards = [
    { label: 'Matches', value: stats.matches, icon: '⚔️' },
    { label: 'Wins', value: stats.wins, color: 'text-success' },
    { label: 'Rating', value: stats.rating, color: 'text-accent' },
    { label: 'Win Rate', value: `${stats.winRate}%`, color: stats.winRate >= 50 ? 'text-success' : 'text-error' },
  ];

  return (
    <div className="card p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-tertiary/20 to-tertiary/5 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-tertiary">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Performance</h2>
            <p className="text-text-secondary text-sm">Your stats at a glance</p>
          </div>
        </div>
        {loading && (
          <span className="text-xs text-text-muted animate-pulse">Updating...</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {statCards.map((stat, idx) => (
          <div 
            key={idx}
            className="relative p-5 rounded-xl bg-surface-elevated border border-border hover:border-accent/30 transition-all duration-300 group overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-accent/5 to-transparent rounded-bl-full transition-transform group-hover:scale-150"></div>
            
            <div className="relative z-10">
              {stat.icon && (
                <div className="text-2xl mb-2">{stat.icon}</div>
              )}
              <div className={`text-3xl font-bold ${stat.color || 'text-text'} mb-1`}>
                {loading ? (
                  <div className="h-8 w-20 bg-surface-hover rounded animate-pulse"></div>
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Win Rate Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-text-secondary">Win Rate</span>
          <span className="font-medium">{stats.winRate}%</span>
        </div>
        <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-success to-accent rounded-full transition-all duration-500"
            style={{ width: `${stats.winRate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
