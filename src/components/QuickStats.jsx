export default function QuickStats({ stats, loading }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-8 shadow-sm transition-all relative overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-colors duration-300">
      {/* Top gradient border effect */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-0 transition-opacity duration-300 hover:opacity-100"></div>

      <h2 className="text-2xl font-bold mb-6 bg-clip-text text-text-secondary bg-gradient-to-br from-primary to-secondary">
        📊 Performance {loading && <span className="text-[0.8rem] opacity-60">(updating...)</span>}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Total Matches', value: stats.matches },
          { label: 'Wins', value: stats.wins, color: '#10b981' },
          { label: 'Rating', value: stats.rating },
          { label: 'Win Rate', value: `${stats.winRate}%`, color: stats.winRate >= 50 ? '#10b981' : '#ef4444' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-surface-alt p-6 rounded-xl text-center border-2 border-transparent transition-all cursor-pointer relative overflow-hidden hover:border-primary hover:-translate-y-1 hover:shadow-md hover:bg-primary-light group transition-colors duration-300">
            {/* Radial gradient effect */}
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

            <div className="text-[2rem] font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-primary to-secondary relative z-10" style={stat.color ? { backgroundImage: 'none', color: stat.color, WebkitTextFillColor: 'initial' } : {}}>
              {stat.value}
            </div>
            <div className="text-[0.85rem] text-text-secondary relative z-10">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
