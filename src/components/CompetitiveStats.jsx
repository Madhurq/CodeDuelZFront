import { useState, useEffect } from 'react';

export default function CompetitiveStats({ profiles, onAddClick }) {
  const [platformCards, setPlatformCards] = useState([]);

  useEffect(() => {
    loadPlatformData();
  }, [profiles]);

  const loadPlatformData = async () => {
    const cards = [];

    if (profiles.leetcode) {
      try {
        const response = await fetch(`https://leetcode.com/graphql/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `query { userProfile(username: "${profiles.leetcode}") { userStats { totalSolved acSubmission { submissions } } } }`
          })
        });

        const data = await response.json();
        const stats = data.data?.userProfile?.userStats;
        if (stats) {
          cards.push({
            platform: 'LeetCode',
            icon: 'L',
            iconClass: 'leetcode',
            stats: [
              { label: 'Solved', value: stats.totalSolved || 0 },
              { label: 'Accepted', value: stats.acSubmission?.submissions || 0 }
            ],
            link: `https://leetcode.com/${profiles.leetcode}`
          });
        }
      } catch (error) {
        console.error('LeetCode error:', error);
      }
    }

    if (profiles.codechef) {
      try {
        const response = await fetch(`https://competitive-coding-api.herokuapp.com/api/codechef/${profiles.codechef}`);
        const data = await response.json();
        if (data.status === 'success') {
          cards.push({
            platform: 'CodeChef',
            icon: 'C',
            iconClass: 'codechef',
            stats: [
              { label: 'Solutions', value: data.result.solution_count || 0 },
              { label: 'Fully Solved', value: data.result.fully_solved || 0 }
            ],
            link: `https://www.codechef.com/users/${profiles.codechef}`
          });
        }
      } catch (error) {
        console.error('CodeChef error:', error);
      }
    }

    if (profiles.codeforces) {
      try {
        const response = await fetch(`https://codeforces.com/api/user.info?handles=${profiles.codeforces}`);
        const data = await response.json();
        if (data.status === 'OK') {
          const user = data.result[0];
          cards.push({
            platform: 'Codeforces',
            icon: 'CF',
            iconClass: 'codeforces',
            stats: [
              { label: 'Rating', value: user.rating || 0 },
              { label: 'Max Rating', value: user.maxRating || 0 }
            ],
            link: `https://codeforces.com/profile/${profiles.codeforces}`
          });
        }
      } catch (error) {
        console.error('Codeforces error:', error);
      }
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
