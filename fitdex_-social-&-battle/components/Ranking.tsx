import React from 'react';
import { User, Friend } from '../types';
import { ArrowLeft, Crown, TrendingUp, Shield, Trophy, Diamond } from 'lucide-react';

interface RankingProps {
  currentUser: User;
  friends: Friend[];
  onBack: () => void;
}

const Ranking: React.FC<RankingProps> = ({ currentUser, friends, onBack }) => {
  // Combine current user with friends
  const allUsers = [
      {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          points: currentUser.points,
          isMe: true
      },
      ...friends.map(f => ({...f, isMe: false}))
  ];

  // Sort by points descending
  const leaderboard = allUsers.sort((a, b) => b.points - a.points);

  // Get top 3
  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];
  const rest = leaderboard.slice(3);

  // Helper to determine rank based on points (Logic mirrors Battle.tsx ARENAS)
  const getRankInfo = (points: number) => {
    if (points >= 600) return { name: 'Arena Diamante', icon: Diamond, color: 'text-cyan-400' };
    if (points >= 350) return { name: 'Arena Prata', icon: Shield, color: 'text-gray-400' };
    if (points >= 150) return { name: 'Arena Ouro', icon: Trophy, color: 'text-yellow-400' };
    return { name: 'Arena Bronze', icon: Shield, color: 'text-orange-600' };
  };

  return (
    <div className="min-h-screen bg-black text-white animate-fade-in pb-24">
       {/* Header */}
       <div className="px-4 pt-8 pb-6 bg-indigo-900/10 border-b border-indigo-900/30">
          <div className="flex items-center mb-6">
            <button onClick={onBack} className="p-2 -ml-2 mr-2 hover:bg-gray-800 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div>
                <h1 className="text-2xl font-bold flex items-center">
                    <TrendingUp className="mr-2 text-emerald-400" /> Ranking Global
                </h1>
                <p className="text-xs text-gray-400">Os melhores da semana</p>
            </div>
          </div>

          {/* Podium */}
          <div className="flex justify-center items-end space-x-4 mt-8 mb-4">
              {/* 2nd Place */}
              {top2 && (
                  <div className="flex flex-col items-center">
                      <div className="relative mb-2">
                          <img src={top2.avatar} className="w-14 h-14 rounded-full border-4 border-gray-400" alt="" />
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">#2</div>
                      </div>
                      <span className="text-xs font-bold text-gray-300 max-w-[80px] truncate">{top2.name}</span>
                      <span className="text-[10px] text-indigo-400 font-bold">{top2.points} pts</span>
                      <div className="w-16 h-24 bg-gradient-to-t from-gray-800 to-gray-700 rounded-t-lg mt-2 opacity-80"></div>
                  </div>
              )}

              {/* 1st Place */}
              {top1 && (
                  <div className="flex flex-col items-center z-10 -mx-2">
                      <Crown className="text-yellow-400 mb-1 animate-bounce" size={24} fill="currentColor" />
                      <div className="relative mb-2">
                          <img src={top1.avatar} className="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)]" alt="" />
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-sm font-black px-3 py-0.5 rounded-full shadow-lg">#1</div>
                      </div>
                      <span className="text-sm font-bold text-white max-w-[100px] truncate">{top1.name}</span>
                      <span className="text-xs text-yellow-400 font-bold">{top1.points} pts</span>
                      <div className="w-20 h-32 bg-gradient-to-t from-yellow-600/40 to-yellow-500/20 rounded-t-lg mt-2 border-t border-yellow-500/50"></div>
                  </div>
              )}

              {/* 3rd Place */}
              {top3 && (
                  <div className="flex flex-col items-center">
                      <div className="relative mb-2">
                          <img src={top3.avatar} className="w-14 h-14 rounded-full border-4 border-amber-700" alt="" />
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">#3</div>
                      </div>
                      <span className="text-xs font-bold text-gray-300 max-w-[80px] truncate">{top3.name}</span>
                      <span className="text-[10px] text-indigo-400 font-bold">{top3.points} pts</span>
                      <div className="w-16 h-16 bg-gradient-to-t from-amber-900 to-amber-800 rounded-t-lg mt-2 opacity-80"></div>
                  </div>
              )}
          </div>
       </div>

       {/* List */}
       <div className="px-4 mt-4 space-y-2">
          {rest.map((user, index) => {
              const rank = getRankInfo(user.points);
              return (
                <div 
                    key={user.id} 
                    className={`flex items-center justify-between p-3 rounded-xl border ${
                        user.isMe 
                        ? 'bg-indigo-900/30 border-indigo-500/50' 
                        : 'bg-gray-900 border-gray-800'
                    }`}
                >
                    <div className="flex items-center space-x-3">
                        <span className="w-6 text-center font-bold text-gray-500">{index + 4}</span>
                        <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
                        <div>
                            <h3 className={`text-sm font-bold ${user.isMe ? 'text-white' : 'text-gray-300'}`}>
                                {user.name} {user.isMe && '(Você)'}
                            </h3>
                            <div className="flex items-center space-x-1">
                                <rank.icon size={12} className={rank.color} />
                                <span className={`text-xs font-medium ${rank.color}`}>{rank.name}</span>
                            </div>
                        </div>
                    </div>
                    <span className="font-bold text-indigo-400 text-sm">{user.points} pts</span>
                </div>
              );
          })}
       </div>
    </div>
  );
};

export default Ranking;