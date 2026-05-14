import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, onSnapshot, collection, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  GraduationCap, 
  Wallet, 
  Leaf, 
  Trophy, 
  ArrowUpRight,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WalletSummary from '../components/dashboard/WalletSummary';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [rank, setRank] = useState(null);
  
  useEffect(() => {
    if (!currentUser) return;
    
    // Subscribe to real-time updates for the user's profile and wallet
    const unsubUser = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    });

    // Subscribe to real-time updates for the user's recent submissions
    const submissionsQuery = query(
      collection(db, 'submissions'),
      where('userId', '==', currentUser.uid),
      orderBy('submittedAt', 'desc'),
      limit(5)
    );

    const unsubSubmissions = onSnapshot(submissionsQuery, (snapshot) => {
      const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecentActivities(activities);
    });

    return () => {
      unsubUser();
      unsubSubmissions();
    };
  }, [currentUser]);

  // Separate effect for Leaderboard since it depends on userData
  useEffect(() => {
    if (!currentUser || !userData) return;
    
    // Determine the grouping ID (e.g., their university name, or a fallback)
    const orgId = userData?.studentProfile?.university || userData?.organizationId || 'global';
    
    // Subscribe to the current active leaderboard period
    const unsubLeaderboard = onSnapshot(doc(db, `leaderboard/${orgId}/periods/current_month`), (docSnap) => {
      if (docSnap.exists()) {
        const rankings = docSnap.data().rankings || [];
        const myRankEntry = rankings.find(r => r.userId === currentUser.uid);
        if (myRankEntry) {
          setRank(myRankEntry.rank);
        } else {
          setRank('-'); // Unranked
        }
      } else {
        setRank('-'); // Leaderboard document doesn't exist yet
      }
    });

    return () => unsubLeaderboard();
  }, [currentUser, userData]);

  // Extract data with fallbacks while loading
  const balance = userData?.wallet?.balance || 0;
  const university = userData?.studentProfile?.university || "Your University";

  // Helpers for formatting
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    const now = new Date();
    const date = timestamp.toDate();
    const diffInHours = Math.round((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.round(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const formatActivityType = (type) => {
    if (!type) return 'Activity';
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* Header Profile Section */}
      <div className="bg-forest-800 text-white pt-12 pb-20 px-6 rounded-b-[2.5rem] relative overflow-hidden shadow-lg">
        {/* Decorative Circles */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-forest-600 rounded-full blur-3xl opacity-50 mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-forest-900 rounded-full blur-2xl opacity-50 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-forest-200 text-sm font-medium mb-1 flex items-center gap-1.5">
                <GraduationCap size={16} />
                Student Guardian
              </p>
              <h1 className="text-2xl font-bold tracking-tight">
                Hi, {userData?.displayName?.split(' ')[0] || currentUser?.displayName?.split(' ')[0] || 'Student'} 👋
              </h1>
            </div>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center">
              <span className="font-bold text-lg">
                {(userData?.displayName || currentUser?.displayName || 'S').charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Academic Wallet Card */}
          <WalletSummary 
            variant="student"
            balance={balance}
            rank={rank}
            locationLabel={university}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 -mt-8 relative z-20 space-y-6">
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => navigate('/activity')} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-md hover:border-forest-200 transition-all active:scale-[0.98]">
            <div className="w-12 h-12 rounded-full bg-forest-50 text-forest-600 flex items-center justify-center">
              <Leaf size={24} />
            </div>
            <span className="font-bold text-gray-800 text-sm">Log Activity</span>
          </button>
          
          <button onClick={() => navigate('/learn')} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-md hover:border-forest-200 transition-all active:scale-[0.98]">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <GraduationCap size={24} />
            </div>
            <span className="font-bold text-gray-800 text-sm">Learning Modules</span>
          </button>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 text-lg">Recent Impact</h3>
            <button className="text-forest-600 text-sm font-semibold flex items-center">
              See all <ArrowUpRight size={16} />
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No recent activities found.</p>
            ) : recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 group">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  activity.verificationStatus === 'approved' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-500'
                }`}>
                  {activity.verificationStatus === 'approved' ? <Leaf size={18} /> : <Clock size={18} />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm group-hover:text-forest-600 transition-colors">
                    {formatActivityType(activity.activityType)}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">{formatTimeAgo(activity.submittedAt)}</p>
                </div>
                <div className="text-right">
                  <span className={`font-bold text-sm ${
                    activity.verificationStatus === 'approved' ? 'text-forest-600' : 'text-gray-400'
                  }`}>
                    {activity.verificationStatus === 'approved' ? `+${activity.creditsAwarded || 0}` : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
