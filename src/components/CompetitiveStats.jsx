import { useState, useEffect } from 'react';

export default function CompetitiveStats({ profiles, onAddClick }) {
  const [platformCards, setPlatformCards] = useState([]);

  useEffect(() => {
    loadPlatformData();
  }, [profiles]);

  const loadPlatformData = () => {
    const cards = [];

    // Static data for now - you can connect to APIs later
    if (profiles.leetcode) {
      cards.push({
        platform: 'LeetCode',
        icon: 'LC',
        iconClass: 'leetcode',
        stats: [
          { label: 'Solved', value: 247 },
          { label: 'Easy', value: 89 },
          { label: 'Medium', value: 132 },
          { label: 'Hard', value: 26 }
        ],
        link: `https://leetcode.com/${profiles.leetcode}`
      });
    }

    if (profiles.codechef) {
      cards.push({
        platform: 'CodeChef',
        icon: 'CC',
        iconClass: 'codechef',
        stats: [
          { label: 'Rating', value: 1847 },
          { label: 'Stars', value: '4★' },
          { label: 'Global Rank', value: '12,453' },
          { label: 'Country Rank', value: '2,341' }
        ],
        link: `https://www.codechef.com/users/${profiles.codechef}`
      });
    }

    if (profiles.codeforces) {
      cards.push({
        platform: 'Codeforces',
        icon: 'CF',
        iconClass: 'codeforces',
        stats: [
          { label: 'Rating', value: 1523 },
          { label: 'Max Rating', value: 1682 },
          { label: 'Rank', value: 'Specialist' },
          { label: 'Contests', value: 45 }
        ],
        link: `https://codeforces.com/profile/${profiles.codeforces}`
      });
    }

    setPlatformCards(cards);
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
      {platformCards.map((card) => (
        <div key={card.platform} className="bg-surface border-2 border-border rounded-xl p-6 shadow-sm transition-all relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-lg hover:border-transparent transition-colors duration-300">
          {/* Border gradient on hover via pseudo element */}
          <div className="absolute -inset-[2px] bg-gradient-to-br from-primary to-secondary rounded-xl opacity-0 -z-10 transition-opacity duration-300 group-hover:opacity-100"></div>
          {/* Inner bg to show border */}
          <div className="absolute inset-0 bg-surface rounded-[10px] -z-10 transition-colors duration-300"></div>

          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all group-hover:scale-110 group-hover:rotate-6 ${card.iconClass === 'leetcode' ? 'bg-[#fbbf24]' :
              card.iconClass === 'codechef' ? 'bg-[#9400d3]' :
                card.iconClass === 'codeforces' ? 'bg-[#1f95cf]' : 'bg-gray-400'
              }`}>
              {card.icon}
            </div>
            <div className="text-[1.1rem] font-bold text-text">{card.platform}</div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 text-center">
            {card.stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-[1.5rem] font-bold text-primary">{stat.value}</div>
                <div className="text-[0.8rem] text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
          <a href={card.link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-primary text-[0.9rem] font-semibold transition-all px-4 py-2 rounded-md bg-primary-light hover:bg-primary hover:text-white hover:translate-x-1">
            View Profile →
          </a>
        </div>
      ))}
    </div>
  );
}
