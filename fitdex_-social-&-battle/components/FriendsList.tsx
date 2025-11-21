import React, { useState } from 'react';
import { Friend, AppView } from '../types';
import { ArrowLeft, Search, UserPlus, MoreVertical, MessageCircle, UserMinus, Check, X } from 'lucide-react';

interface FriendsListProps {
  friends: Friend[];
  onNavigate: (view: AppView) => void;
}

const FriendsList: React.FC<FriendsListProps> = ({ friends, onNavigate }) => {
  const [viewMode, setViewMode] = useState<'list' | 'add'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock suggestions for "Add Friends"
  const [suggestions, setSuggestions] = useState([
    { id: 's1', name: 'Ricardo Oliveira', avatar: 'https://randomuser.me/api/portraits/men/33.jpg', mutual: 3, status: 'idle' },
    { id: 's2', name: 'Camila Martins', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', mutual: 1, status: 'idle' },
    { id: 's3', name: 'João Victor', avatar: 'https://randomuser.me/api/portraits/men/55.jpg', mutual: 5, status: 'idle' },
    { id: 's4', name: 'Beatriz Costa', avatar: 'https://randomuser.me/api/portraits/women/91.jpg', mutual: 0, status: 'idle' },
  ]);

  const handleAddFriend = (id: string) => {
    setSuggestions(prev => prev.map(user => 
      user.id === id ? { ...user, status: 'sent' } : user
    ));
  };

  const filteredFriends = friends.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white animate-fade-in pb-24 flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 pt-8 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button 
              onClick={() => viewMode === 'add' ? setViewMode('list') : onNavigate(AppView.HOME)} 
              className="p-2 -ml-2 mr-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-xl font-bold">{viewMode === 'add' ? 'Adicionar Amigos' : 'Meus Amigos'}</h2>
          </div>
          
          {viewMode === 'list' && (
            <button 
              onClick={() => setViewMode('add')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-900/30 flex items-center active:scale-95 transition-transform"
            >
              <UserPlus size={16} className="mr-2" />
              Adicionar
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={viewMode === 'add' ? "Buscar pessoas..." : "Buscar amigos..."}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-xl pl-10 pr-4 py-3 focus:border-indigo-500 outline-none transition-all placeholder-gray-500"
            />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        
        {/* LIST VIEW */}
        {viewMode === 'list' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1 mb-2">
               <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                 Total ({filteredFriends.length})
               </span>
            </div>
            
            {filteredFriends.map(friend => (
              <div key={friend.id} className="bg-gray-900/50 border border-gray-800 p-3 rounded-2xl flex items-center justify-between group hover:border-gray-700 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                     <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full object-cover" />
                     {friend.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-gray-900 rounded-full"></div>}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-200">{friend.name}</h3>
                    <div className="flex items-center space-x-2">
                       <span className="text-xs text-indigo-400 font-medium">{friend.points} pts</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => onNavigate(AppView.SOCIAL)}
                    className="p-2 bg-gray-800 hover:bg-indigo-600 hover:text-white text-gray-400 rounded-xl transition-colors"
                  >
                    <MessageCircle size={18} />
                  </button>
                  <button className="p-2 bg-gray-800 hover:bg-red-900/50 hover:text-red-500 text-gray-400 rounded-xl transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            ))}

            {filteredFriends.length === 0 && (
               <div className="text-center py-10 text-gray-500">
                  <p>Nenhum amigo encontrado.</p>
               </div>
            )}
          </div>
        )}

        {/* ADD VIEW */}
        {viewMode === 'add' && (
          <div className="space-y-4 animate-slide-up">
             <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/20 p-4 rounded-2xl mb-6 flex items-center justify-between">
                <div>
                   <h3 className="font-bold text-white">Convide amigos</h3>
                   <p className="text-xs text-gray-400">Ganhe 500 diamantes por convite!</p>
                </div>
                <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                   Convidar
                </button>
             </div>

             <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Sugestões para você</h3>
             
             {suggestions.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(user => (
                <div key={user.id} className="flex items-center justify-between py-2">
                   <div className="flex items-center space-x-3">
                      <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                         <h3 className="font-bold text-sm text-white">{user.name}</h3>
                         <p className="text-xs text-gray-500">{user.mutual} amigos em comum</p>
                      </div>
                   </div>
                   
                   {user.status === 'sent' ? (
                      <button disabled className="px-4 py-1.5 bg-gray-800 text-gray-500 rounded-lg text-xs font-bold flex items-center">
                         <Check size={14} className="mr-1" /> Enviado
                      </button>
                   ) : (
                      <button 
                        onClick={() => handleAddFriend(user.id)}
                        className="px-4 py-1.5 bg-white text-black hover:bg-gray-200 rounded-lg text-xs font-bold transition-colors active:scale-95"
                      >
                         Adicionar
                      </button>
                   )}
                </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsList;