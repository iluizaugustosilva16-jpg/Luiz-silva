import React from 'react';
import { Home, Swords, Dumbbell, MessageCircle, User } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  // Helper to check active state
  const isActive = (view: AppView) => currentView === view;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 px-6 pb-6 pt-2 z-50">
      <div className="flex justify-between items-end max-w-md mx-auto relative">
        
        {/* Home */}
        <button
          onClick={() => onNavigate(AppView.HOME)}
          className={`flex flex-col items-center space-y-1 w-12 ${isActive(AppView.HOME) ? 'text-indigo-400' : 'text-gray-500'}`}
        >
          <Home size={24} strokeWidth={isActive(AppView.HOME) ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Início</span>
        </button>

        {/* Battle */}
        <button
          onClick={() => onNavigate(AppView.BATTLE)}
          className={`flex flex-col items-center space-y-1 w-12 ${isActive(AppView.BATTLE) ? 'text-indigo-400' : 'text-gray-500'}`}
        >
          <Swords size={24} strokeWidth={isActive(AppView.BATTLE) ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Batalha</span>
        </button>

        {/* Floating FAB - Training */}
        <div className="relative -top-6">
          <button
            onClick={() => onNavigate(AppView.TRAINING)}
            className={`w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] border-[6px] border-black active:scale-95 transition-transform ${isActive(AppView.TRAINING) ? 'ring-1 ring-white/20' : ''}`}
          >
            <Dumbbell size={28} strokeWidth={3} />
          </button>
        </div>

        {/* Direct / Social */}
        <button
          onClick={() => onNavigate(AppView.SOCIAL)}
          className={`flex flex-col items-center space-y-1 w-12 ${isActive(AppView.SOCIAL) || isActive(AppView.CHAT) ? 'text-indigo-400' : 'text-gray-500'}`}
        >
          <MessageCircle size={24} strokeWidth={isActive(AppView.SOCIAL) ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Direct</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => onNavigate(AppView.PROFILE)}
          className={`flex flex-col items-center space-y-1 w-12 ${isActive(AppView.PROFILE) ? 'text-indigo-400' : 'text-gray-500'}`}
        >
          <User size={24} strokeWidth={isActive(AppView.PROFILE) ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Perfil</span>
        </button>
      </div>
    </div>
  );
};

export default Navigation;