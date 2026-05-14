import { CheckCircle, Lock, PlayCircle, BookOpen, Clock } from 'lucide-react';

export default function ModuleCard({ 
  title, 
  description, 
  status = 'locked', // 'locked' | 'available' | 'in_progress' | 'completed'
  progress = 0, 
  reward = 50,
  duration = "5 min",
  onClick 
}) {
  
  // Determine styling based on status
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isInProgress = status === 'in_progress';

  return (
    <div 
      onClick={!isLocked ? onClick : undefined}
      className={`relative bg-white rounded-3xl p-5 border transition-all ${
        isLocked 
          ? 'border-gray-100 opacity-75' 
          : isCompleted 
            ? 'border-green-100 hover:border-green-200 cursor-pointer shadow-sm hover:shadow-md' 
            : 'border-blue-100 hover:border-blue-300 cursor-pointer shadow-md hover:shadow-lg ring-2 ring-blue-500/10'
      }`}
    >
      <div className="flex gap-4">
        
        {/* Status Icon Indicator */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
          isLocked ? 'bg-gray-100 text-gray-400' :
          isCompleted ? 'bg-green-100 text-green-600' :
          'bg-blue-100 text-blue-600'
        }`}>
          {isLocked ? <Lock size={24} /> :
           isCompleted ? <CheckCircle size={24} /> :
           <PlayCircle size={24} className="ml-1" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className={`font-bold text-base leading-tight ${isLocked ? 'text-gray-500' : 'text-gray-900'}`}>
              {title}
            </h3>
          </div>
          
          <p className="text-xs text-gray-500 font-medium mb-3 line-clamp-2">
            {description}
          </p>
          
          {/* Metadata Row */}
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
              isCompleted ? 'bg-green-50 text-green-700' : 
              isLocked ? 'bg-gray-100 text-gray-500' : 
              'bg-blue-50 text-blue-700'
            }`}>
              {isCompleted ? 'Done' : `+ $${reward}`}
            </span>
            <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
              <Clock size={12} /> {duration}
            </span>
          </div>

          {/* Progress Bar (Only visible if in progress) */}
          {isInProgress && (
            <div className="mt-4">
              <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                <span>In Progress</span>
                <span className="text-blue-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
