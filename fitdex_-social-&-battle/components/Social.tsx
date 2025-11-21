import React, { useState } from 'react';
import { Friend, User, AppView } from '../types';
import { Search, ChevronLeft, MoreVertical, Play, Mic, Send, Phone, Video, Image as ImageIcon } from 'lucide-react';

interface SocialProps {
  user: User;
  friends: Friend[];
  onNavigate: (view: AppView) => void;
}

const Social: React.FC<SocialProps> = ({ user, friends, onNavigate }) => {
  const [selectedFriend, setSelectedFriend] = useState<any | null>(null);
  
  // Mock data with more context for the chat list
  const messagesList = [
    { id: 'm1', name: 'Danny Moore', time: '10:32', text: 'Eai, como foi o treino hoje?', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', unread: false },
    { id: 'm2', name: 'Nancy Clark', time: '11:01', text: "O projeto novo tá insano!", avatar: 'https://randomuser.me/api/portraits/women/44.jpg', unread: false },
    { id: 'm3', name: 'Daniel Colon', time: '18:12', text: 'Bora fechar aquele supino?', avatar: 'https://randomuser.me/api/portraits/men/86.jpg', unread: true },
    { id: 'm4', name: 'Janet Munoz', time: '09:30', text: "Não esquece da creatina kkk", avatar: 'https://randomuser.me/api/portraits/women/68.jpg', unread: false },
    { id: 'm5', name: 'Marjorie Roberts', time: '21:06', text: 'Espero você no crossfit!', avatar: 'https://randomuser.me/api/portraits/women/33.jpg', unread: false },
    { id: 'm6', name: 'Jason Brown', time: '11:40', text: "Cara, bati meu PR!", avatar: 'https://randomuser.me/api/portraits/men/12.jpg', unread: false },
    { id: 'm7', name: 'Lucas Silva', time: 'Ontem', text: "Manda o pix do shake", avatar: 'https://randomuser.me/api/portraits/men/45.jpg', unread: false },
  ];

  // --- Sub-component for Chat Detail (Full Screen Overlay) ---

  const AudioBubble = ({ time, isMe }: { time: string; isMe: boolean }) => (
    <div className={`flex items-center space-x-3 p-3 rounded-2xl w-64 ${isMe ? 'bg-indigo-600' : 'bg-gray-800'}`}>
      <button className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 ${isMe ? 'bg-indigo-400 text-white' : 'bg-gray-700 text-gray-300'}`}>
        <Play size={12} className="ml-0.5" />
      </button>
      <div className="flex-1 flex items-center space-x-0.5 h-6">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className={`w-1 rounded-full transition-all duration-500 ${isMe ? 'bg-indigo-300' : 'bg-gray-500'}`} 
            style={{ 
                height: `${Math.random() * 16 + 4}px`,
                opacity: i < 12 ? 1 : 0.5 
            }}
          ></div>
        ))}
      </div>
      <span className={`text-[10px] ${isMe ? 'text-indigo-200' : 'text-gray-500'}`}>{time}</span>
    </div>
  );

  const ChatDetail = () => {
    if (!selectedFriend) return null;

    return (
      <div className="fixed inset-0 bg-black z-[60] flex flex-col animate-fade-in">
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between bg-gray-900/80 backdrop-blur-md border-b border-gray-800 pt-safe-top">
          <div className="flex items-center">
            <button 
                onClick={() => setSelectedFriend(null)}
                className="p-2 -ml-2 mr-1 text-gray-400 hover:text-white rounded-full transition-colors"
            >
                <ChevronLeft size={26} />
            </button>
            <img src={selectedFriend.avatar} alt="" className="w-10 h-10 rounded-full border border-gray-700 object-cover" />
            <div className="ml-3">
                <h3 className="font-bold text-white text-sm">{selectedFriend.name}</h3>
                <span className="text-emerald-500 text-xs flex items-center">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                    Online agora
                </span>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-indigo-400">
            <button className="p-2 hover:bg-gray-800 rounded-full"><Phone size={20} /></button>
            <button className="p-2 hover:bg-gray-800 rounded-full"><Video size={20} /></button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-black custom-scrollbar">
            <div className="flex justify-center">
                <span className="text-xs font-medium text-gray-600 bg-gray-900 px-3 py-1 rounded-full">Hoje</span>
            </div>

            {/* Friend Message */}
            <div className="flex justify-start max-w-[85%]">
                <div className="bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 text-gray-200 text-sm relative group">
                    <p>Eai, como foi o treino hoje?</p>
                    <span className="text-[10px] text-gray-500 absolute bottom-1 right-3 opacity-0 group-hover:opacity-100 transition-opacity">10:32</span>
                </div>
            </div>

            {/* My Audio Message */}
            <div className="flex justify-end">
                <AudioBubble time="10:37" isMe={true} />
            </div>

            {/* Friend Message */}
            <div className="flex justify-start max-w-[85%]">
                <div className="bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 text-gray-200 text-sm">
                    <p>O projeto novo tá insano! Preciso te mostrar os resultados da semana passada.</p>
                </div>
            </div>

            {/* My Message */}
            <div className="flex justify-end max-w-[85%]">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl rounded-tr-none px-4 py-3 text-white text-sm shadow-lg shadow-indigo-900/20">
                    <p>Boa! Me manda aí. Tô indo pra academia agora, a gente se fala depois?</p>
                </div>
            </div>
            
             {/* My Message */}
             <div className="flex justify-end max-w-[85%]">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl rounded-tr-none px-4 py-3 text-white text-sm shadow-lg shadow-indigo-900/20">
                    <p>Fechou 👊</p>
                </div>
            </div>
        </div>

        {/* Input Area */}
        <div className="p-3 pb-6 bg-gray-900 border-t border-gray-800">
            <div className="flex items-center bg-black border border-gray-800 rounded-full px-2 py-1">
                <button className="p-2 text-gray-400 hover:text-indigo-400 transition-colors">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                        <ImageIcon size={18} />
                    </div>
                </button>
                <input 
                    type="text" 
                    placeholder="Mensagem..." 
                    className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-gray-600 px-2"
                />
                <button className="p-2 text-gray-400 hover:text-indigo-400 transition-colors">
                    <Mic size={20} />
                </button>
                <button className="p-2 bg-indigo-600 rounded-full text-white ml-1 shadow-lg shadow-indigo-500/40 active:scale-95 transition-transform">
                    <Send size={18} className="ml-0.5" />
                </button>
            </div>
        </div>
      </div>
    );
  };

  if (selectedFriend) {
    return <ChatDetail />;
  }

  // --- Main List View ---
  return (
    <div className="flex flex-col h-full bg-black animate-fade-in pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 bg-black/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">Direct</h1>
          <button className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-indigo-400 border border-gray-800">
             <MoreVertical size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
                type="text" 
                placeholder="Buscar conversa..." 
                className="w-full bg-gray-900 border border-gray-800 text-gray-200 text-sm rounded-2xl pl-10 pr-4 py-3 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder-gray-600"
            />
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 px-4 space-y-1 overflow-y-auto">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-2 px-2">Recentes</h2>
        {messagesList.map((msg) => (
            <button 
                key={msg.id}
                onClick={() => setSelectedFriend(msg)}
                className="w-full flex items-center p-3 rounded-2xl hover:bg-gray-900/50 transition-colors group border border-transparent hover:border-gray-800"
            >
                <div className="relative">
                    <img src={msg.avatar} alt={msg.name} className="w-14 h-14 rounded-full object-cover border border-gray-800 group-hover:border-gray-600 transition-colors" />
                    {msg.unread && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-indigo-500 border-2 border-black rounded-full"></div>
                    )}
                </div>
                
                <div className="ml-4 flex-1 text-left">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className={`text-sm ${msg.unread ? 'font-bold text-white' : 'font-medium text-gray-200'}`}>
                            {msg.name}
                        </h3>
                        <span className={`text-[10px] ${msg.unread ? 'text-indigo-400 font-bold' : 'text-gray-500'}`}>
                            {msg.time}
                        </span>
                    </div>
                    <p className={`text-xs truncate pr-4 ${msg.unread ? 'text-gray-300 font-medium' : 'text-gray-500'}`}>
                        {msg.text}
                    </p>
                </div>
            </button>
        ))}
      </div>
    </div>
  );
};

export default Social;