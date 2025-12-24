import { useState, useEffect } from 'react';
import ProfileCard from '../components/ProfileCard';
import CompetitiveStats from '../components/CompetitiveStats';
import EditProfiles from '../components/EditProfiles';
import { db } from '../config/firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Profile({ user }) {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
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

  // Load profile data from Firestore
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

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

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading profile...</div>;
  }

  return (
    <div className="container">
      <div className="profile-grid">
        <ProfileCard 
          profileData={profileData}
          onEditClick={() => setEditMode(true)}
          onLogout={handleLogout}
        />
        <div>
          <div className="platforms-header">
            <h2 className="section-title">Competitive Stats</h2>
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
