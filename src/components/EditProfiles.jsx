import { useState } from 'react';

export default function EditProfiles({ profiles, loading, onSave, onCancel }) {
  const [leetcode, setLeetcode] = useState(profiles.leetcode);
  const [codechef, setCodechef] = useState(profiles.codechef);
  const [codeforces, setCodeforces] = useState(profiles.codeforces);

  const handleSave = () => {
    onSave({
      leetcode,
      codechef,
      codeforces
    });
  };

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1rem' }}>Connect Your Accounts</h3>
      <div className="edit-form">
        <div className="form-group">
          <label className="form-label">LeetCode Username</label>
          <input
            type="text"
            className="input-field"
            placeholder="username"
            value={leetcode}
            onChange={(e) => setLeetcode(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">CodeChef Username</label>
          <input
            type="text"
            className="input-field"
            placeholder="username"
            value={codechef}
            onChange={(e) => setCodechef(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Codeforces Handle</label>
          <input
            type="text"
            className="input-field"
            placeholder="handle"
            value={codeforces}
            onChange={(e) => setCodeforces(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={loading}
            style={{ flex: 1 }}
          >
            {loading ? 'Saving...' : 'Save Profiles'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            style={{ flex: 1 }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
