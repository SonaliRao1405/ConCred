import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, PlayCircle, CheckCircle, Volume2, ArrowRight } from 'lucide-react';

// Mock data for the specific lesson
const LESSON_DATA = {
  id: 'mod_2',
  title: 'Smart Savings & Budgeting',
  reward: 75,
  videoUrl: 'https://example.com/mock-video.mp4',
  transcript: "A budget is a plan for your money. By locking your conservation credits into the community vault, you not only keep them safe from fraud, but they slowly grow over time through community interest. We recommend the 50/30/20 rule: 50% for needs, 30% for wants, and 20% locked in savings.",
  quiz: {
    question: "According to the community vault rules, what percentage of your credits should ideally be locked into savings?",
    options: [
      "10%",
      "20%",
      "50%",
      "None, keep it all in cash."
    ],
    correctAnswerIndex: 1
  }
};

export default function Lesson() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // In a real app, you would fetch the lesson data based on moduleId here
  const lesson = LESSON_DATA; 

  const handleSelectOption = (index) => {
    if (isAnswerRevealed) return;
    setSelectedAnswer(index);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswerRevealed(true);
  };

  const handleComplete = () => {
    setIsCompleting(true);
    // Simulate Cloud Function granting reward
    setTimeout(() => {
      setIsCompleting(false);
      navigate('/learn', { replace: true });
    }, 1500);
  };

  const isCorrect = selectedAnswer === lesson.quiz.correctAnswerIndex;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center sticky top-0 z-50">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="ml-2 flex-1">
          <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-0.5">Lesson 2 of 4</p>
          <h1 className="text-sm font-bold text-gray-900 truncate">{lesson.title}</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Video Player Placeholder */}
        <div className="w-full aspect-video bg-gray-900 relative group cursor-pointer">
          <img 
            src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80" 
            alt="Video Thumbnail" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlayCircle size={40} className="text-white" />
            </div>
          </div>
          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-800">
            <div className="h-full bg-blue-500 w-[40%]"></div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="px-5 py-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-black text-gray-900 leading-tight">
              {lesson.title}
            </h2>
            <button className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
              <Volume2 size={20} />
            </button>
          </div>
          
          <p className="text-gray-600 leading-relaxed text-base mb-8">
            {lesson.transcript}
          </p>

          <div className="h-[1px] w-full bg-gray-100 mb-8"></div>

          {/* Knowledge Check */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={20} className="text-blue-600" />
              <h3 className="font-bold text-gray-900 text-lg">Knowledge Check</h3>
            </div>
            
            <p className="text-gray-800 font-semibold mb-5 leading-snug">
              {lesson.quiz.question}
            </p>

            <div className="space-y-3">
              {lesson.quiz.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isThisCorrect = isAnswerRevealed && index === lesson.quiz.correctAnswerIndex;
                const isThisWrong = isAnswerRevealed && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectOption(index)}
                    disabled={isAnswerRevealed}
                    className={`w-full p-4 rounded-2xl border-2 text-left font-medium transition-all ${
                      isThisCorrect ? 'bg-green-50 border-green-500 text-green-800' :
                      isThisWrong ? 'bg-red-50 border-red-500 text-red-800' :
                      isSelected ? 'bg-blue-50 border-blue-500 text-blue-800' :
                      'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Check Answer Button */}
            {!isAnswerRevealed && selectedAnswer !== null && (
              <button 
                onClick={handleCheckAnswer}
                className="w-full mt-6 bg-gray-900 text-white font-bold py-4 rounded-2xl animate-in fade-in slide-in-from-bottom-2"
              >
                Check Answer
              </button>
            )}

            {/* Success/Failure State */}
            {isAnswerRevealed && (
              <div className={`mt-6 p-5 rounded-2xl border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} animate-in fade-in slide-in-from-bottom-2`}>
                <h4 className={`font-bold text-lg mb-1 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? 'Excellent!' : 'Not quite right.'}
                </h4>
                <p className={`text-sm mb-4 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect 
                    ? `You've mastered this concept. Claim your ${lesson.reward} credits!` 
                    : "The recommended savings rate is 20%. Please try the module again."}
                </p>
                
                {isCorrect && (
                  <button 
                    onClick={handleComplete}
                    disabled={isCompleting}
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-70"
                  >
                    {isCompleting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Claim {lesson.reward} Credits <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
