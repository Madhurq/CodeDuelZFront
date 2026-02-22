import { useState } from 'react';

export default function EditProfiles({ profiles, loading, onSave, onCancel }) {
  const [leetcode, setLeetcode] = useState(profiles.leetcode);
  const [codechef, setCodechef] = useState(profiles.codechef);
  const [codeforces, setCodeforces] = useState(profiles.codeforces);
  const [bio, setBio] = useState(profiles.bio || '');

  const handleSave = () => {
    onSave({
      leetcode,
      codechef,
      codeforces,
      bio,
      avatar: profiles.avatar
    });
  };

  return (
    <div className="card p-8">
      <h3 className="text-xl font-bold mb-6">Edit Profile</h3>
      
      <div className="space-y-6">
        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Bio</label>
          <textarea
            className="input resize-none"
            placeholder="Tell us about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            maxLength={500}
          />
          <div className="text-xs text-text-muted text-right mt-1">{bio.length}/500</div>
        </div>

        <hr className="border-border" />

        <h4 className="text-lg font-semibold">Connected Platforms</h4>

        {/* LeetCode */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">LeetCode Username</label>
          <div className="relative">
            <input
              type="text"
              className="input pl-12"
              placeholder="username"
              value={leetcode}
              onChange={(e) => setLeetcode(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded bg-yellow-400/20 flex items-center justify-center text-yellow-400 text-xs font-bold">LC</div>
          </div>
        </div>

        {/* CodeChef */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">CodeChef Username</label>
          <div className="relative">
            <input
              type="text"
              className="input pl-12"
              placeholder="username"
              value={codechef}
              onChange={(e) => setCodechef(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center text-purple-500 text-xs font-bold">CC</div>
          </div>
        </div>

        {/* Codeforces */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Codeforces Handle</label>
          <div className="relative">
            <input
              type="text"
              className="input pl-12"
              placeholder="handle"
              value={codeforces}
              onChange={(e) => setCodeforces(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center text-blue-500 text-xs font-bold">CF</div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
