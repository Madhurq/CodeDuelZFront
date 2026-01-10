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
      avatar: profiles.avatar // Keep existing avatar
    });
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-8 shadow-sm transition-all relative overflow-hidden hover:shadow-lg hover:-translate-y-0.5 mt-8 transition-colors duration-300">
      <h3 className="text-xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-br from-primary to-secondary">Edit Profile</h3>
      <div className="flex flex-col gap-6">
        {/* Bio Section */}
        <div className="flex flex-col gap-2">
          <label className="text-[0.9rem] font-semibold text-text">Bio</label>
          <textarea
            className="w-full px-4 py-3.5 border-2 border-border rounded-lg text-[0.95rem] font-inherit transition-all bg-surface-alt text-text focus:outline-none focus:border-primary focus:bg-primary-light focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] resize-none"
            placeholder="Tell us about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            maxLength={500}
          />
          <span className="text-xs text-text-secondary text-right">{bio.length}/500</span>
        </div>

        <hr className="border-border" />

        <h4 className="text-lg font-semibold text-text -mb-2">Connect Your Accounts</h4>

        <div className="flex flex-col gap-2">
          <label className="text-[0.9rem] font-semibold text-text">LeetCode Username</label>
          <input
            type="text"
            className="w-full px-4 py-3.5 border-2 border-border rounded-lg text-[0.95rem] font-inherit transition-all bg-surface-alt text-text focus:outline-none focus:border-primary focus:bg-primary-light focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] focus:-translate-y-px"
            placeholder="username"
            value={leetcode}
            onChange={(e) => setLeetcode(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[0.9rem] font-semibold text-text">CodeChef Username</label>
          <input
            type="text"
            className="w-full px-4 py-3.5 border-2 border-border rounded-lg text-[0.95rem] font-inherit transition-all bg-surface-alt text-text focus:outline-none focus:border-primary focus:bg-primary-light focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] focus:-translate-y-px"
            placeholder="username"
            value={codechef}
            onChange={(e) => setCodechef(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[0.9rem] font-semibold text-text">Codeforces Handle</label>
          <input
            type="text"
            className="w-full px-4 py-3.5 border-2 border-border rounded-lg text-[0.95rem] font-inherit transition-all bg-surface-alt text-text focus:outline-none focus:border-primary focus:bg-primary-light focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] focus:-translate-y-px"
            placeholder="handle"
            value={codeforces}
            onChange={(e) => setCodeforces(e.target.value)}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            className="flex-1 py-3.5 px-7 rounded-lg font-bold text-[0.95rem] cursor-pointer transition-all relative overflow-hidden bg-gradient-to-br from-primary to-secondary text-white shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(59,130,246,0.4)] active:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Profiles'}
          </button>
          <button
            type="button"
            className="flex-1 py-3.5 px-7 rounded-lg font-bold text-[0.95rem] cursor-pointer transition-all bg-surface text-text border-2 border-border shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:bg-surface-alt hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
