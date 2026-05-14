import { Wallet, TrendingUp, Trophy, MapPin, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WalletSummary({ 
  variant = 'guardian', 
  balance = 0, 
  lifetimeEarned = 0, 
  trustRate = 100,
  rank = null,
  locationLabel = "Location" 
}) {
  const navigate = useNavigate();

  if (variant === 'student') {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl transition-transform hover:scale-[1.02]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-forest-100 text-sm font-medium mb-1 flex items-center gap-2">
              <Wallet size={16} /> Academic Credits
            </p>
            <h2 className="text-4xl font-extrabold tracking-tight">{balance.toLocaleString()}</h2>
          </div>
          <div className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Trophy size={12} /> {rank === null ? '...' : rank === '-' ? 'Unranked' : `Rank #${rank}`}
          </div>
        </div>
        
        <div className="h-[1px] w-full bg-white/20 my-4"></div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-forest-100 font-medium">{locationLabel}</span>
          <button onClick={() => navigate('/leaderboard')} className="text-white font-bold flex items-center gap-1 hover:text-forest-200 transition-colors">
            View Campus Leaderboard <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl transition-transform hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-forest-100 text-sm font-medium mb-1 flex items-center gap-2">
            <Wallet size={16} /> Total Balance
          </p>
          <h2 className="text-5xl font-extrabold tracking-tight tabular-nums">${balance.toLocaleString()}</h2>
        </div>
        <div className="bg-green-500/20 text-green-100 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <TrendingUp size={12} /> {trustRate}% Trust Rate
        </div>
      </div>
      
      <div className="h-[1px] w-full bg-white/20 my-4"></div>
      
      <div className="flex justify-between items-center text-sm">
        <span className="text-forest-100 font-medium flex items-center gap-1">
          <MapPin size={14} /> {locationLabel}
        </span>
        <span className="text-white font-semibold">
          Lifetime: ${lifetimeEarned.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
