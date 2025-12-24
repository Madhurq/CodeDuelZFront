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

  if (platformCards.length === 0) {
    return (
      <div className="no-profiles">
        <p>No connected profiles yet</p>
        <button className="add-profile-btn" onClick={onAddClick}>
          + Add Profile
        </button>
      </div>
    );
  }

  return (
    <div className="platforms-grid">
      {platformCards.map((card) => (
        <div key={card.platform} className="platform-card">
          <div className="platform-header">
            <div className={`platform-icon ${card.iconClass}`}>
              {card.icon}
            </div>
            <div className="platform-name">{card.platform}</div>
          </div>
          <div className="platform-stats">
            {card.stats.map((stat) => (
              <div key={stat.label} className="platform-stat">
                <div className="platform-stat-value">{stat.value}</div>
                <div className="platform-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
          <a href={card.link} target="_blank" rel="noopener noreferrer" className="platform-link">
            View Profile →
          </a>
        </div>
      ))}
    </div>
  );
}
