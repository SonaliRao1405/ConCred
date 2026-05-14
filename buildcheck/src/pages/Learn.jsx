import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ChevronLeft, BookOpen, Star, Trophy } from 'lucide-react';
import ModuleCard from '../components/learn/ModuleCard';

const MOCK_MODULES = [
  {
    id: 'mod_1',
    title: 'Introduction to Microfinance',
    description: 'Learn how village banking works and how to safely leverage your conservation credits for small business loans.',
    duration: '5 min',
    reward: 50,
    status: 'completed',
    progress: 100
  },
  {
    id: 'mod_2',
    title: 'Smart Savings & Budgeting',
    description: 'Master the 50/30/20 rule and learn how to lock your credits into the high-yield community vault.',
    duration: '8 min',
    reward: 75,
    status: 'in_progress',
    progress: 40
  },
  {
    id: 'mod_3',
    title: 'Digital Fraud Prevention',
    description: 'Protect your wallet! Learn how to spot phishing scams and secure your PIN.',
    duration: '6 min',
    reward: 100,
    status: 'available',
    progress: 0
  },
  {
    id: 'mod_4',
    title: 'Advanced Equipment Grants',
    description: 'Unlock Level 2 MFI borrowing rates by passing this assessment on agricultural equipment.',
    duration: '15 min',
    reward: 250,
    status: 'locked',
    progress: 0
  }
];

export default function Learn() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('modules'); // 'modules' | 'certifications'

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
          <h1 className="text-xl font-bold text-gray-900 ml-2">Learn & Earn</h1>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-gray-100 px-2 mb-4">
          <button 
            onClick={() => setActiveTab('modules')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'modules' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'
            }`}
          >
            <BookOpen size={16} /> Literacy Modules
          </button>
          <button 
            onClick={() => setActiveTab('certifications')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'certifications' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'
            }`}
          >
            <Trophy size={16} /> Certifications
          </button>
        </div>
      </div>

      <div className="px-5 py-6">
        {/* Hero Callout */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl p-6 text-white mb-8 shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-20">
            <Star size={100} className="fill-white" />
          </div>
          <div className="relative z-10">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block backdrop-blur-md">
              Level 1 Scholar
            </span>
            <h2 className="text-2xl font-black mb-2">Upgrade your Trust Rate</h2>
            <p className="text-blue-100 text-sm font-medium pr-10 leading-relaxed">
              Complete modules to boost your financial literacy score. Higher scores unlock lower interest rates from MFI partners!
            </p>
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-lg mb-2">Current Curriculum</h3>
          
          {MOCK_MODULES.map(module => (
            <ModuleCard 
              key={module.id}
              title={module.title}
              description={module.description}
              status={module.status}
              progress={module.progress}
              reward={module.reward}
              duration={module.duration}
              onClick={() => {
                if (module.status !== 'locked') {
                  navigate(`/learn/${module.id}`);
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
