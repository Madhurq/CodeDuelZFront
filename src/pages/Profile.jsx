import { useState, useEffect } from 'react';
import ProfileCard from '../components/ProfileCard';
import CompetitiveStats from '../components/CompetitiveStats';
import EditProfiles from '../components/EditProfiles';
import { db } from '../config/firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
  const [loading, setLoading] = useState(false);

  // Load profile data from Firestore
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        // Set a timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          setLoading(false);
          console.warn('Profile loading timeout - using default values');
        }, 5000); // 5 second timeout

        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        clearTimeout(timeoutId);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfileData({
            name: data.name || user.displayName || 'Developer',
            email: user.email,
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
        } else {
          // Create new user document
          const defaultData = {
            name: user.displayName || 'Developer',
            email: user.email,
            wins: 0,
            losses: 0,
            rating: 1000,
            matches: 0,
            leetcode: '',
            codechef: '',
            codeforces: '',
            createdAt: new Date()
          };
          await setDoc(userDocRef, defaultData);
          setProfileData({
            name: defaultData.name,
            email: user.email,
            wins: 0,
            losses: 0,
            rating: 1000,
            rank: '-',
            matches: 0
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSaveProfiles = async (newProfiles) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(
        userDocRef,
        {
          leetcode: newProfiles.leetcode,
          codechef: newProfiles.codechef,
          codeforces: newProfiles.codeforces
        },
        { merge: true }
      );
      setProfiles(newProfiles);
      setEditMode(false);
    } catch (error) {
      console.error('Error saving profiles:', error);
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      const { signOut } = await import('firebase/auth');
      const { auth } = await import('../config/firebase.js');
      await signOut(auth);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-8">
      {loading && (
        <div className="p-4 text-center text-[0.9rem] opacity-60 mb-4 animate-pulse">
          Updating profile data...
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
              loading={false}
              onSave={handleSaveProfiles}
              onCancel={() => setEditMode(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
