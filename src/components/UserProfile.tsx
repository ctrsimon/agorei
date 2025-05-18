import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';

interface UserProfileData {
  username: string;
  bio: string;
}

export default function UserProfile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      if (!currentUser) return;
      setLoading(true);
      setError('');
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfileData);
        } else {
          setError('Profile not found.');
        }
      } catch (err) {
        setError('Failed to fetch profile.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [currentUser]);

  if (loading) {
    return <div className="text-center mt-8">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <div className="mb-2">
        <span className="font-semibold">Email:</span> {currentUser?.email}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Username:</span> {profile?.username}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Bio:</span> {profile?.bio}
      </div>
    </div>
  );
} 