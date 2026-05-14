import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, onSnapshot, collection, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  ShieldCheck, 
  Wallet, 
  Leaf, 
  ArrowUpRight,
  Clock,
  History,
  MapPin,
  TrendingUp,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WalletSummary from '../components/dashboard/WalletSummary';

export default function GuardianDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  
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

  // Extract data with fallbacks while loading
  const balance = userData?.wallet?.balance || 0;
  const lifetimeEarned = userData?.wallet?.lifetimeEarned || 0;
  const village = userData?.guardianProfile?.village || "Your Village";
  const verificationRate = userData?.creditProfile?.verificationRate || 100;
  const literacyLevel = userData?.creditProfile?.literacyLevel || 1;

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
      <div className="bg-gradient-to-b from-forest-700 to-forest-900 text-white pt-12 pb-20 px-6 rounded-b-[2.5rem] relative overflow-hidden shadow-lg">
        {/* Decorative Topography Pattern (Simulated with SVG shapes) */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
             <path d="M0,0 Q50,100 100,0 L100,100 L0,100 Z" fill="white" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-forest-200 text-sm font-medium mb-1 flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-green-400" />
                Field Guardian
              </p>
              <h1 className="text-2xl font-bold tracking-tight">
                Hi, {userData?.displayName?.split(' ')[0] || currentUser?.displayName?.split(' ')[0] || 'Guardian'} 👋
              </h1>
            </div>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center">
              <span className="font-bold text-lg">
                {(userData?.displayName || currentUser?.displayName || 'G').charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Main Wallet Card */}
          <WalletSummary 
            variant="guardian"
            balance={balance}
            lifetimeEarned={lifetimeEarned}
            trustRate={verificationRate}
            locationLabel={village}
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
          
          <button onClick={() => navigate('/wallet')} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-md hover:border-forest-200 transition-all active:scale-[0.98]">
            <div className="w-12 h-12 rounded-full bg-earth-50 text-earth-600 flex items-center justify-center">
              <History size={24} />
            </div>
            <span className="font-bold text-gray-800 text-sm">View Ledger</span>
          </button>
        </div>

        {/* Financial Literacy Progress */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <BookOpen size={20} className="text-blue-500" />
              Financial Literacy
            </h3>
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">Level {literacyLevel}</span>
          </div>
          
          <div className="mb-5">
            <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
              <span>Progress to Level {literacyLevel + 1}</span>
              <span>60%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: '60%' }}></div>
            </div>
          </div>
          
          <button onClick={() => navigate('/learn')} className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-3 rounded-2xl transition-colors flex justify-center items-center gap-2 group">
            Continue Learning
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
                  activity.verificationStatus === 'approved' ? 'bg-green-50 text-green-600' : 
                  activity.verificationStatus === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-500'
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
                    activity.verificationStatus === 'approved' ? 'text-forest-600' : 
                    activity.verificationStatus === 'rejected' ? 'text-red-500' : 'text-gray-400'
                  }`}>
                    {activity.verificationStatus === 'approved' ? `+$${activity.creditsAwarded || 0}` : 
                     activity.verificationStatus === 'rejected' ? 'Rejected' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Child Activity Analytics */}
        <div className="bg-gradient-to-br from-earth-50 to-orange-50/50 rounded-3xl p-6 shadow-sm border border-earth-100/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 text-lg">Family Impact</h3>
            <span className="bg-earth-100 text-earth-700 text-xs font-bold px-2 py-1 rounded-full">Dependents</span>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-earth-100 mb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-earth-100 text-earth-600 rounded-full flex items-center justify-center font-bold">
                  K
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Kofi (Student)</h4>
                  <p className="text-xs text-gray-500 font-medium">Linked Account</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-medium mb-0.5">Contributed</p>
                <p className="font-bold text-earth-600">+$120</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 font-medium mb-1">Modules Done</p>
                <p className="font-bold text-gray-900">14</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 font-medium mb-1">Study Streak</p>
                <p className="font-bold text-orange-500">5 Days 🔥</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
