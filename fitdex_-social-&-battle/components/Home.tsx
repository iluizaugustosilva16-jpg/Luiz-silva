import React from 'react';
import { User, AppView } from '../types';
import { Bell, Plus, BarChart2, Users, ChevronRight, Utensils, Dumbbell, Camera, CalendarCheck, Medal, Target, Zap } from 'lucide-react';

interface HomeProps {
  user: User;
  onNavigate: (view: AppView) => void;
}

const Home: React.FC<HomeProps> = ({ user, onNavigate }) => {
  
  // Simple calculation for progress to next level (mocked logic)
  const pointsPerLevel = 1000;
  const currentLevelProgress = user.points % pointsPerLevel;
  const progressPercent = (currentLevelProgress / pointsPerLevel) * 100;
  const pointsToNext = pointsPerLevel - currentLevelProgress;

  return (
    <div className="pb-24 animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-6 pt-8">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src={user.avatar} 
              alt="User" 
              className="w-10 h-10 rounded-full border-2 border-indigo-500 p-0.5"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black"></div>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Boa Tarde!</p>
            <h1 className="text-white font-bold text-sm leading-tight">{user.name}</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 relative">
            <Bell size={20} />
            <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full"></div>
          </button>
          <div className="h-10 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center space-x-2">
             <span className="text-indigo-400 text-xs">💎</span>
             <span className="text-white font-bold text-sm">{user.points}</span>
             <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                <Plus size={10} className="text-white" />
             </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Hero Card - User Progress (Substituindo Rei da Semana) */}
        <div className="w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-3xl p-6 shadow-xl shadow-indigo-500/20 relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="inline-block bg-white/20 px-2 py-0.5 rounded-full text-[10px] text-white font-semibold mb-1 backdrop-blur-sm border border-white/10">
                            Nível Atual
                        </div>
                        <h2 className="text-4xl font-black text-white italic">{user.level}</h2>
                    </div>
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                        <Zap className="text-yellow-400 fill-yellow-400" size={24} />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium text-indigo-100">
                        <span>XP Atual</span>
                        <span>{pointsToNext} xp para o próximo</span>
                    </div>
                    <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden backdrop-blur-sm">
                        <div 
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Decorative Circles */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/20 rounded-full blur-xl"></div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
            {/* Conquistas */}
            <button 
                onClick={() => onNavigate(AppView.ACHIEVEMENTS)}
                className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-orange-400 to-amber-500 p-4 flex flex-col items-center justify-center text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-transform relative overflow-hidden"
            >
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-2 backdrop-blur-sm">
                        <Medal size={20} />
                    </div>
                    <span className="font-bold text-sm">Conquistas</span>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
            </button>

            {/* Amigos */}
            <button 
                onClick={() => onNavigate(AppView.FRIENDS)}
                className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-rose-400 to-orange-500 p-4 flex flex-col items-center justify-center text-white shadow-lg shadow-rose-500/20 active:scale-95 transition-transform relative overflow-hidden"
            >
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-2 backdrop-blur-sm">
                        <Users size={20} />
                    </div>
                    <span className="font-bold text-sm">Amigos</span>
                </div>
                 <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>
            </button>
        </div>

        {/* Check-in Banner */}
        <button 
            onClick={() => onNavigate(AppView.TRAINING)}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 relative overflow-hidden text-left group active:scale-[0.98] transition-transform"
        >
            <div className="relative z-10 pr-16">
                <h3 className="text-white font-bold text-xl mb-1">Check-in Diário</h3>
                <p className="text-white/90 text-sm mb-3">Registre seu treino de hoje e mantenha o foco!</p>
                <div className="bg-white text-emerald-600 font-bold text-xs px-4 py-2 rounded-full inline-block shadow-sm">
                    Fazer Check-in
                </div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="text-emerald-200/40 drop-shadow-lg">
                    <CalendarCheck size={64} className="rotate-12 group-hover:rotate-[20deg] transition-transform duration-300" fill="currentColor" />
                </div>
            </div>
        </button>

        {/* Bottom Section - "Navegue Inteligente" */}
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">Navegue Inteligente!</h3>
                <button className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700">
                    <ChevronRight size={18} />
                </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
                 {/* Receitas */}
                 <button 
                    onClick={() => onNavigate(AppView.RECIPES)}
                    className="aspect-square bg-gray-900 rounded-3xl flex flex-col items-center justify-center p-4 border border-gray-800 group hover:border-indigo-500/50 transition-colors active:scale-95"
                 >
                    <Utensils className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" size={24} />
                    <span className="text-gray-500 text-xs font-medium">Receitas</span>
                 </button>

                 {/* Exercícios */}
                 <button 
                    onClick={() => onNavigate(AppView.TRAINING)}
                    className="aspect-square bg-gray-900 rounded-3xl flex flex-col items-center justify-center p-4 border border-gray-800 group hover:border-indigo-500/50 transition-colors active:scale-95"
                 >
                    <Dumbbell className="text-orange-500 mb-2 group-hover:scale-110 transition-transform" size={24} />
                    <span className="text-gray-500 text-xs font-medium">Exercícios</span>
                 </button>

                 {/* Calc. Calorias */}
                 <button 
                    onClick={() => onNavigate(AppView.CALCULATOR)}
                    className="aspect-square bg-gray-900 rounded-3xl flex flex-col items-center justify-center p-4 border border-gray-800 group hover:border-indigo-500/50 transition-colors active:scale-95"
                 >
                    <Camera className="text-purple-500 mb-2 group-hover:scale-110 transition-transform" size={24} />
                    <span className="text-gray-500 text-xs font-medium text-center">Calc. Calorias</span>
                 </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;