import React, { useState } from 'react';
import { Achievement } from '../types';
import { ArrowLeft, Lock, Dumbbell, Footprints, Bike, Swords, Diamond, CalendarCheck, Timer, Medal, Trophy } from 'lucide-react';

interface AchievementsProps {
  achievements: Achievement[];
  onBack: () => void;
}

const Achievements: React.FC<AchievementsProps> = ({ achievements, onBack }) => {
  const [filter, setFilter] = useState<'All' | 'Battle' | 'Gym' | 'Cardio'>('All');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Dumbbell': return <Dumbbell size={24} />;
      case 'Footprints': return <Footprints size={24} />;
      case 'Bike': return <Bike size={24} />;
      case 'Swords': return <Swords size={24} />;
      case 'Diamond': return <Diamond size={24} />;
      case 'CalendarCheck': return <CalendarCheck size={24} />;
      case 'Timer': return <Timer size={24} />;
      default: return <Medal size={24} />;
    }
  };

  const filteredList = achievements.filter(a => {
    if (filter === 'All') return true;
    if (filter === 'Battle') return a.category === 'Battle';
    if (filter === 'Gym') return a.category === 'Gym';
    if (filter === 'Cardio') return a.category === 'Run' || a.category === 'Cycle';
    return true;
  });

  // Calculate overall progress
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const percentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-black text-white animate-fade-in pb-24">
       {/* Header */}
       <div className="px-4 pt-8 pb-6 bg-gradient-to-b from-gray-900 to-black border-b border-gray-800">
          <div className="flex items-center mb-6">
            <button onClick={onBack} className="p-2 -ml-2 mr-2 hover:bg-gray-800 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div>
                <h1 className="text-2xl font-bold flex items-center">
                    <Trophy className="mr-2 text-amber-500" /> Conquistas
                </h1>
                <p className="text-xs text-gray-400">Desbloqueie emblemas e suba de nível</p>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700 relative overflow-hidden">
             <div className="flex justify-between items-end mb-2 relative z-10">
                 <div>
                    <span className="text-3xl font-bold text-white">{unlockedCount}</span>
                    <span className="text-gray-400 text-sm">/{totalCount}</span>
                 </div>
                 <span className="text-amber-500 font-bold">{percentage}% Completo</span>
             </div>
             <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden relative z-10">
                 <div className="bg-gradient-to-r from-amber-500 to-orange-600 h-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
             </div>
             <Trophy className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32 rotate-12" />
          </div>
       </div>

       {/* Filter Tabs */}
       <div className="flex items-center justify-between px-4 py-4 overflow-x-auto no-scrollbar space-x-2">
          {['All', 'Battle', 'Gym', 'Cardio'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    filter === f 
                    ? 'bg-white text-black' 
                    : 'bg-gray-900 text-gray-500 border border-gray-800'
                }`}
              >
                  {f === 'All' ? 'Todas' : f}
              </button>
          ))}
       </div>

       {/* List */}
       <div className="px-4 space-y-4">
          {filteredList.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`p-4 rounded-2xl border relative overflow-hidden group ${
                    achievement.unlocked 
                    ? 'bg-gray-900/80 border-indigo-500/30' 
                    : 'bg-black border-gray-800 opacity-70'
                }`}
              >
                  <div className="flex items-center relative z-10">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-lg ${
                          achievement.unlocked 
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' 
                          : 'bg-gray-800 text-gray-600'
                      }`}>
                          {achievement.unlocked ? getIcon(achievement.icon) : <Lock size={20} />}
                      </div>
                      <div className="flex-1">
                          <h3 className={`font-bold text-sm ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                              {achievement.title}
                          </h3>
                          <p className="text-xs text-gray-500 mb-2">{achievement.description}</p>
                          
                          {/* Progress Bar for individual item */}
                          <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${achievement.unlocked ? 'bg-green-500' : 'bg-indigo-500'}`} 
                                    style={{ width: `${Math.min(100, (achievement.progress / achievement.maxProgress) * 100)}%` }}
                                ></div>
                          </div>
                          <div className="text-[10px] text-right text-gray-500 mt-1">
                              {achievement.progress}/{achievement.maxProgress}
                          </div>
                      </div>
                  </div>
                  
                  {achievement.unlocked && (
                      <div className="absolute top-0 right-0 p-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                      </div>
                  )}
              </div>
          ))}

          {filteredList.length === 0 && (
              <div className="text-center py-12 text-gray-500 text-sm">
                  Nenhuma conquista nesta categoria.
              </div>
          )}
       </div>
    </div>
  );
};

export default Achievements;