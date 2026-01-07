import { useState, useEffect } from 'react';
import ProfileCard from '../components/ProfileCard';
import CompetitiveStats from '../components/CompetitiveStats';
import EditProfiles from '../components/EditProfiles';
import { apiGet, apiPut } from '../services/api';
import { auth } from '../config/firebase.js';
import { signOut } from 'firebase/auth';

export default function Profile({ user }) {
  const [profileData, setProfileData] = useState({
    name: user?.displayName || 'Developer',
    email: user?.email || '',
    wins: 0,
    losses: 0,
    rating: 1000,
    rank: '-',
    matches: 0
  });

  const [profiles, setProfiles] = useState({
    leetcode: '',
    codechef: '',
    codeforces: ''
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load profile data from Backend API
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Call the backend API - token is automatically attached
        const data = await apiGet('/api/profile');

        console.log('Profile loaded from API:', data);

        setProfileData({
          name: data.name || user.displayName || 'Developer',
          email: data.email || user.email,
          wins: data.wins || 0,
          losses: data.losses || 0,
          rating: data.rating || 1000,
          rank: data.rank || '-',
          matches: data.matches || 0
        });

        setProfiles({
          leetcode: data.leetcode || '',
          codechef: data.codechef || '',
          codeforces: data.codeforces || ''
        });
      } catch (error) {
        console.error('Error loading profile:', error);
        setError('Failed to load profile. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSaveProfiles = async (newProfiles) => {
    try {
      setLoading(true);

      // Call the backend API to update profiles
      await apiPut('/api/profile', {
        leetcode: newProfiles.leetcode,
        codechef: newProfiles.codechef,
        codeforces: newProfiles.codeforces
      });

      setProfiles(newProfiles);
      setEditMode(false);
    } catch (error) {
      console.error('Error saving profiles:', error);
      setError('Failed to save profiles.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await signOut(auth);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-8">
      {loading && (
        <div className="p-4 text-center text-[0.9rem] opacity-60 mb-4 animate-pulse">
          Loading profile data...
        </div>
      )}

      {error && (
        <div className="p-4 text-center text-red-500 mb-4 bg-red-500/10 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        <ProfileCard
          profileData={profileData}
          onEditClick={() => setEditMode(true)}
          onLogout={handleLogout}
        />
        <div>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
            <h2 className="text-2xl font-bold">Competitive Stats</h2>
          </div>

          {!editMode && (
            <CompetitiveStats
              profiles={profiles}
              onAddClick={() => setEditMode(true)}
            />
          )}

          {editMode && (
            <EditProfiles
              profiles={profiles}
              loading={loading}
              onSave={handleSaveProfiles}
              onCancel={() => setEditMode(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

