import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import WalletSummary from '../components/dashboard/WalletSummary';
import { 
  ChevronLeft, 
  ArrowDownRight, 
  BookOpen, 
  Leaf, 
  ShieldAlert, 
  Lock,
  Flame
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WalletLedger() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    // Fetch User Profile for Total Balance
    const unsubUser = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    });

    // Fetch the immutable ledger of transactions
    const q = query(
      collection(db, 'wallet_transactions'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc'),
      limit(50) // Load recent 50 for MVP
    );

    const unsubTxs = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(txs);
      setLoading(false);
    });

    return () => {
      unsubUser();
      unsubTxs();
    };
  }, [currentUser]);

  // Helper to get correct icon and color for transaction type
  const getTransactionConfig = (type) => {
    switch (type) {
      case 'activity_reward':
        return { icon: <Leaf size={18} />, color: 'text-green-600', bg: 'bg-green-100', sign: '+' };
      case 'literacy_bonus':
        return { icon: <BookOpen size={18} />, color: 'text-blue-600', bg: 'bg-blue-100', sign: '+' };
      case 'streak_bonus':
        return { icon: <Flame size={18} />, color: 'text-orange-500', bg: 'bg-orange-100', sign: '+' };
      case 'admin_adjustment':
        return { icon: <ShieldAlert size={18} />, color: 'text-purple-600', bg: 'bg-purple-100', sign: '' }; // Could be + or -
      case 'savings_lock':
        return { icon: <Lock size={18} />, color: 'text-gray-600', bg: 'bg-gray-200', sign: '-' }; // Money moved to savings
      default:
        return { icon: <ArrowDownRight size={18} />, color: 'text-forest-600', bg: 'bg-forest-100', sign: '+' };
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return timestamp.toDate().toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center sticky top-0 z-50 shadow-sm">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900 ml-2">Wallet Ledger</h1>
      </div>

      {/* Top Wallet Summary */}
      <div className="bg-gradient-to-b from-forest-700 to-forest-900 px-5 pt-8 pb-12 -mb-8">
        <WalletSummary 
          variant={userData?.role === 'student_guardian' ? 'student' : 'guardian'}
          balance={userData?.wallet?.balance || 0}
          lifetimeEarned={userData?.wallet?.lifetimeEarned || 0}
          trustRate={userData?.creditProfile?.verificationRate || 100}
          locationLabel={userData?.guardianProfile?.village || userData?.studentProfile?.university || "Your Location"}
          rank={userData?.role === 'student_guardian' ? '-' : null}
        />
      </div>

      {/* Ledger */}
      <div className="px-5 py-6 relative z-10">
        <h2 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-4 pl-2">Transaction History</h2>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-forest-500/30 border-t-forest-500 rounded-full animate-spin"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium">No transactions yet.</p>
            <p className="text-sm text-gray-400 mt-1">Complete activities to earn credits!</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {transactions.map((tx) => {
                const config = getTransactionConfig(tx.type);
                const isNegative = tx.amount < 0 || config.sign === '-';
                
                return (
                  <div key={tx.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${config.bg} ${config.color}`}>
                      {config.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm truncate">
                        {tx.description || tx.type.replace('_', ' ')}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{formatTime(tx.createdAt)}</p>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <p className={`font-bold text-base ${isNegative ? 'text-gray-900' : 'text-forest-600'}`}>
                        {isNegative ? '' : '+'}${Math.abs(tx.amount).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                        Bal: ${tx.balanceAfter?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
