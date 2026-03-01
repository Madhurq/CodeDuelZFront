import { useState, useEffect } from 'react';
import ProfileCard from '../components/ProfileCard';
import CompetitiveStats from '../components/CompetitiveStats';
import EditProfiles from '../components/EditProfiles';
import { apiGet, apiPut, invalidateProfileCache } from '../services/api';
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
    codeforces: '',
    bio: '',
    avatar: ''
  });

  const [stats, setStats] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiGet('/profile');

        setProfileData({
          name: data.userName || user.displayName || 'Developer',
          email: data.email || user.email,
          wins: data.wins || 0,
          losses: data.losses || 0,
          rating: data.rating || 1000,
          rank: data.rank || '-',
          matches: data.totalMatches || 0
        });

        setProfiles({
          leetcode: data.leetcodeUsername || '',
          codechef: data.codechefUsername || '',
          codeforces: data.codeforcesHandle || '',
          bio: data.bio || '',
          avatar: data.avatar || ''
        });

        try {
          const statsData = await apiGet('/external-stats');
          setStats(statsData);
        } catch (err) {
          console.error('Error loading external stats:', err);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSaveProfiles = async (newProfiles) => {
    try {
      setLoading(true);
      await apiPut('/profile', {
        leetcodeUsername: newProfiles.leetcode,
        codechefUsername: newProfiles.codechef,
        codeforcesHandle: newProfiles.codeforces,
        bio: newProfiles.bio,
        avatar: newProfiles.avatar
      });
      setProfiles(newProfiles);
      setEditMode(false);
      invalidateProfileCache();
    } catch (error) {
      console.error('Error saving profiles:', error);
      setError('Failed to save profiles.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (file) => {
    try {
      setLoading(true);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Avatar = reader.result;
        try {
          await apiPut('/profile', { avatar: base64Avatar });
          setProfiles(prev => ({ ...prev, avatar: base64Avatar }));
        } catch (err) {
          console.error('Error saving avatar:', err);
          setError('Failed to save avatar.');
        } finally {
          setLoading(false);
        }
      };
      reader.onerror = () => {
        setError('Failed to read image file.');
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error processing avatar:', err);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await signOut(auth);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">
            Your <span className="text-gradient">Profile</span>
          </h1>
          <p className="text-text-secondary text-lg">
            Manage your competitive profile and connected accounts
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-error/10 border border-error/20 text-error">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          <ProfileCard
            profileData={{ ...profileData, avatar: profiles.avatar, bio: profiles.bio }}
            onEditClick={() => setEditMode(true)}
            onLogout={handleLogout}
            onAvatarChange={handleAvatarChange}
          />

          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-tertiary/20 to-tertiary/5 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-tertiary">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                </div>
                <h2 className="text-xl font-bold">Competitive Stats</h2>
              </div>
            </div>

            {!editMode && (
              <CompetitiveStats
                profiles={profiles}
                stats={stats}
                onAddClick={() => setEditMode(true)}
                codeduelzStats={{ wins: profileData.wins, losses: profileData.losses, matches: profileData.matches }}
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
    </div>
  );
}
