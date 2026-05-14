import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import GuardianDashboard from './GuardianDashboard';
import StudentDashboard from './StudentDashboard';

export default function DashboardRouter() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
      setLoading(false);
    });

    return () => unsub();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-forest-500/30 border-t-forest-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Route to the correct dashboard based on the user's role
  if (userData?.role === 'student_guardian') {
    return <StudentDashboard />;
  }

  // Default to Guardian dashboard for 'guardian' and others
  return <GuardianDashboard />;
}
