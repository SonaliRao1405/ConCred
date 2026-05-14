import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Medal, Award, ChevronLeft, Star, Users, GraduationCap, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_RANKINGS = [
  { userId: '1', displayName: 'Kwame O.', credits: 4500, rank: 1, verifiedActivities: 45 },
  { userId: '2', displayName: 'Amara D.', credits: 3800, rank: 2, verifiedActivities: 38 },
  { userId: '3', displayName: 'Kofi Mensah', credits: 3200, rank: 3, verifiedActivities: 32 },
  { userId: '4', displayName: 'Grace T.', credits: 2900, rank: 4, verifiedActivities: 29 },
  { userId: '5', displayName: 'Elias B.', credits: 2100, rank: 5, verifiedActivities: 21 },
  { userId: '6', displayName: 'Sarah L.', credits: 1800, rank: 6, verifiedActivities: 18 },
  { userId: '7', displayName: 'David K.', credits: 1500, rank: 7, verifiedActivities: 15 },
];

const MOCK_SCHOOL_RANKINGS = [
  { userId: 'school_1', displayName: 'University of Zambia', credits: 145000, rank: 1, verifiedActivities: 1450 },
  { userId: 'school_2', displayName: 'Copperbelt University', credits: 138000, rank: 2, verifiedActivities: 1380 },
  { userId: 'school_3', displayName: 'Mulungushi Univ.', credits: 132000, rank: 3, verifiedActivities: 1320 },
  { userId: 'school_4', displayName: 'Cavendish Univ.', credits: 99000, rank: 4, verifiedActivities: 990 },
];

const MOCK_COMMUNITY_RANKINGS = [
  { userId: 'comm_1', displayName: 'Mfuwe Village', credits: 210000, rank: 1, verifiedActivities: 2100 },
  { userId: 'comm_2', displayName: 'Kabwe District', credits: 185000, rank: 2, verifiedActivities: 1850 },
  { userId: 'comm_3', displayName: 'Livingstone Comm.', credits: 160000, rank: 3, verifiedActivities: 1600 },
  { userId: 'comm_4', displayName: 'Ndola Rural', credits: 120000, rank: 4, verifiedActivities: 1200 },
];

export default function Leaderboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('weekly'); // 'weekly' or 'monthly'
  const [category, setCategory] = useState('individuals'); // 'individuals', 'schools', 'communities'

  useEffect(() => {
    // In a production environment, a Cloud Function aggregates and creates these documents
    const q = query(
      collection(db, 'leaderboards'),
      where('periodType', '==', period),
      where('category', '==', category),
      orderBy('startDate', 'desc'),
      limit(1)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setRankings(snapshot.docs[0].data().rankings || []);
      } else {
        // Fallback to mock data for MVP Demonstration if cloud function hasn't run
        if (category === 'schools') setRankings(MOCK_SCHOOL_RANKINGS);
        else if (category === 'communities') setRankings(MOCK_COMMUNITY_RANKINGS);
        else setRankings(MOCK_RANKINGS);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [period, category]);

  const topThree = rankings.slice(0, 3);
  const remaining = rankings.slice(3);

  const getMedalColor = (rank) => {
    switch(rank) {
      case 1: return 'text-yellow-400 bg-yellow-50 border-yellow-200'; // Gold
      case 2: return 'text-gray-400 bg-gray-50 border-gray-200';       // Silver
      case 3: return 'text-amber-600 bg-amber-50 border-amber-200';    // Bronze
      default: return 'text-gray-500 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-2 flex flex-col sticky top-0 z-50 shadow-sm rounded-b-3xl">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900 ml-2">Leaderboards</h1>
        </div>
        
        {/* Category Toggle (Individuals vs Schools vs Communities) */}
        <div className="flex gap-4 border-b border-gray-100 px-2 mb-4 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setCategory('individuals')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              category === 'individuals' ? 'border-forest-600 text-forest-600' : 'border-transparent text-gray-400'
            }`}
          >
            <Users size={16} /> Individuals
          </button>
          <button 
            onClick={() => setCategory('schools')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              category === 'schools' ? 'border-forest-600 text-forest-600' : 'border-transparent text-gray-400'
            }`}
          >
            <GraduationCap size={16} /> Schools
          </button>
          <button 
            onClick={() => setCategory('communities')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              category === 'communities' ? 'border-forest-600 text-forest-600' : 'border-transparent text-gray-400'
            }`}
          >
            <MapPin size={16} /> Communities
          </button>
        </div>

        {/* Period Toggle (Weekly vs All-Time) */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-2">
          <button 
            onClick={() => setPeriod('weekly')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${period === 'weekly' ? 'bg-white text-forest-600 shadow-sm' : 'text-gray-500'}`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setPeriod('monthly')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${period === 'monthly' ? 'bg-white text-forest-600 shadow-sm' : 'text-gray-500'}`}
          >
            All-Time
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-forest-500/30 border-t-forest-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="px-5 pt-8">
          
          {/* Podium (Top 3) */}
          <div className="flex justify-center items-end gap-3 mb-10 h-48">
            {/* 2nd Place */}
            {topThree[1] && (
              <div className="w-24 flex flex-col items-center pb-0">
                <div className="relative mb-2">
                  <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-md z-10 relative overflow-hidden">
                    <span className="font-bold text-gray-500 text-xl">{topThree[1].displayName.charAt(0)}</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-gray-100 border border-gray-300 rounded-full p-1 z-20">
                    <Medal size={14} className="text-gray-500" />
                  </div>
                </div>
                <div className="w-full bg-gradient-to-t from-gray-200 to-gray-100 rounded-t-2xl h-24 flex flex-col items-center justify-start pt-3 shadow-inner">
                  <span className="font-bold text-gray-700 text-xs text-center px-1 truncate w-full">{topThree[1].displayName}</span>
                  <span className="font-black text-gray-900 mt-1">{topThree[1].credits}</span>
                </div>
              </div>
            )}
            
            {/* 1st Place */}
            {topThree[0] && (
              <div className="w-28 flex flex-col items-center z-10">
                <div className="relative mb-2">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                    <Trophy size={24} className="text-yellow-500 drop-shadow-md" />
                  </div>
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center border-4 border-white shadow-xl z-10 relative overflow-hidden ring-4 ring-yellow-400/20">
                    <span className="font-black text-yellow-600 text-3xl">{topThree[0].displayName.charAt(0)}</span>
                  </div>
                </div>
                <div className="w-full bg-gradient-to-t from-yellow-300 to-yellow-200 rounded-t-2xl h-32 flex flex-col items-center justify-start pt-4 shadow-lg border border-yellow-400/50">
                  <span className="font-black text-yellow-900 text-sm text-center px-1 truncate w-full">{topThree[0].displayName}</span>
                  <span className="font-black text-yellow-900 text-lg mt-1">{topThree[0].credits}</span>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {topThree[2] && (
              <div className="w-24 flex flex-col items-center">
                <div className="relative mb-2">
                  <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center border-4 border-white shadow-md z-10 relative overflow-hidden">
                    <span className="font-bold text-amber-700 text-xl">{topThree[2].displayName.charAt(0)}</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-amber-50 border border-amber-200 rounded-full p-1 z-20">
                    <Award size={14} className="text-amber-600" />
                  </div>
                </div>
                <div className="w-full bg-gradient-to-t from-amber-200 to-amber-100 rounded-t-2xl h-20 flex flex-col items-center justify-start pt-2 shadow-inner">
                  <span className="font-bold text-amber-900 text-xs text-center px-1 truncate w-full">{topThree[2].displayName}</span>
                  <span className="font-black text-amber-900 mt-1">{topThree[2].credits}</span>
                </div>
              </div>
            )}
          </div>

          {/* List Remaining Ranks */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="divide-y divide-gray-50">
              {remaining.map((user) => {
                const isMe = user.userId === currentUser?.uid;
                
                return (
                  <div key={user.userId} className={`p-4 flex items-center gap-4 transition-colors ${isMe ? 'bg-forest-50/50' : 'hover:bg-gray-50'}`}>
                    <div className="w-8 font-bold text-gray-400 text-center">
                      {user.rank}
                    </div>
                    
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 font-bold text-gray-600">
                      {user.displayName.charAt(0)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-bold text-sm truncate ${isMe ? 'text-forest-700' : 'text-gray-900'}`}>
                        {user.displayName} {isMe && <span className="text-forest-500 ml-1 text-xs">(You)</span>}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{user.verifiedActivities} Verified Activities</p>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <p className="font-bold text-base text-gray-900 flex items-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        {user.credits}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
