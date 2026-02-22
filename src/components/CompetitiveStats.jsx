import { useState, useEffect } from 'react';

export default function CompetitiveStats({ profiles, stats, onAddClick }) {
  const [platformCards, setPlatformCards] = useState([]);

  useEffect(() => {
    loadPlatformData();
  }, [profiles, stats]);

  const loadPlatformData = () => {
    const cards = [];

    if (profiles.leetcode) {
      const lc = stats?.leetCode;
      cards.push({
        platform: 'LeetCode',
        icon: 'LC',
        iconClass: 'leetcode',
        bg: 'from-yellow-400/20 to-yellow-600/10',
        stats: lc ? [
          { label: 'Solved', value: lc.totalSolved },
          { label: 'Easy', value: lc.easySolved },
          { label: 'Medium', value: lc.mediumSolved },
          { label: 'Hard', value: lc.hardSolved }
        ] : [{ label: 'Solved', value: '-' }, { label: 'Easy', value: '-' }, { label: 'Medium', value: '-' }, { label: 'Hard', value: '-' }],
        link: `https://leetcode.com/${profiles.leetcode}`
      });
    }

    if (profiles.codechef) {
      const cc = stats?.codeChef;
      cards.push({
        platform: 'CodeChef',
        icon: 'CC',
        iconClass: 'codechef',
        bg: 'from-purple-500/20 to-purple-700/10',
        stats: cc ? [
          { label: 'Rating', value: cc.currentRating || '-' },
          { label: 'Stars', value: cc.stars || '-' }
        ] : [{ label: 'Rating', value: '-' }, { label: 'Stars', value: '-' }],
        link: `https://www.codechef.com/users/${profiles.codechef}`
      });
    }

    if (profiles.codeforces) {
      const cf = stats?.codeforces;
      cards.push({
        platform: 'Codeforces',
        icon: 'CF',
        iconClass: 'codeforces',
        bg: 'from-blue-500/20 to-blue-700/10',
        stats: cf ? [
          { label: 'Rating', value: cf.rating },
          { label: 'Max', value: cf.maxRating },
          { label: 'Rank', value: cf.rank || '-' },
          { label: 'Contrib', value: cf.contribution }
        ] : [{ label: 'Rating', value: '-' }, { label: 'Max', value: '-' }, { label: 'Rank', value: '-' }, { label: 'Contrib', value: '-' }],
        link: `https://codeforces.com/profile/${profiles.codeforces}`
      });
    }

    setPlatformCards(cards);
  };

  if (platformCards.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="w-16 h-16 rounded-xl bg-surface-elevated flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </div>
        <p className="text-lg font-medium mb-2">No platforms connected</p>
        <p className="text-text-secondary text-sm mb-6">
          Connect your coding profiles to showcase your stats
        </p>
        <button onClick={onAddClick} className="btn-primary">
          Connect Platforms
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {platformCards.map((card) => (
        <div key={card.platform} className="card p-6 group">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.bg} flex items-center justify-center font-bold text-lg`}>
              {card.icon}
            </div>
            <div className="text-lg font-bold">{card.platform}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            {card.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-accent">{stat.value}</div>
                <div className="text-xs text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <a 
            href={card.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors"
          >
            View Profile
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
      ))}
      
      <button onClick={onAddClick} className="card p-6 border-dashed hover:border-accent/50 flex flex-col items-center justify-center min-h-[200px] group">
        <div className="w-12 h-12 rounded-xl bg-surface-elevated flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted group-hover:text-accent transition-colors">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
        <span className="text-text-muted group-hover:text-accent transition-colors">Add more platforms</span>
      </button>
    </div>
  );
}
