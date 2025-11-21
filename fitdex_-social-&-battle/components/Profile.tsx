import React, { useState } from 'react';
import { User } from '../types';
import { MOCK_FRIENDS } from '../constants';
import { 
    Trophy, Medal, Dumbbell, Footprints, Bike, Award, Settings, 
    Edit3, CheckCircle, Image as ImageIcon, Users, MessageCircle,
    ChevronLeft, Camera, ChevronDown, Search, BarChart3, Bell, Shield, HelpCircle, ChevronRight,
    Menu, LogOut
} from 'lucide-react';

interface ProfileProps {
  user: User;
  onUpdateProfile: (data: Partial<User>) => void;
  isOwnProfile?: boolean;
  onLogout?: () => void;
}

type Tab = 'Feed' | 'Awards' | 'Gallery' | 'Network';
type ViewMode = 'profile' | 'edit' | 'followers' | 'following' | 'settings';

const Profile: React.FC<ProfileProps> = ({ user, onUpdateProfile, isOwnProfile = true, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Feed');
  const [viewMode, setViewMode] = useState<ViewMode>('profile');
  
  // Local state for friends to handle follow toggling
  const [friendsList, setFriendsList] = useState(MOCK_FRIENDS);

  // Edit Form State
  const [editForm, setEditForm] = useState({
      name: user.name,
      email: user.email || '',
      birthDate: user.birthDate || '',
      location: user.location || '',
      bio: user.bio || '',
      avatar: user.avatar,
      coverPhoto: user.coverPhoto || ''
  });

  const handleSaveProfile = () => {
      onUpdateProfile(editForm);
      setViewMode('profile');
  };

  const handleToggleFollow = (friendId: string) => {
      setFriendsList(prev => prev.map(f => 
          f.id === friendId ? { ...f, isFollowing: !f.isFollowing } : f
      ));
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Dumbbell': return <Dumbbell size={20} />;
      case 'Footprints': return <Footprints size={20} />;
      case 'Bike': return <Bike size={20} />;
      default: return <Award size={20} />;
    }
  };

  // Mock Data for Monthly Check-ins
  const monthlyStats = [
    { month: 'Jan', value: 12, height: '40%' },
    { month: 'Fev', value: 15, height: '50%' },
    { month: 'Mar', value: 18, height: '60%' },
    { month: 'Abr', value: 24, height: '85%' },
    { month: 'Mai', value: 20, height: '70%' },
    { month: 'Jun', value: 28, height: '95%' },
  ];

  // --- Render: Settings Screen ---
  if (viewMode === 'settings') {
      return (
        <div className="min-h-screen bg-black text-white animate-fade-in z-50 relative">
            <div className="flex items-center p-4 pt-8 border-b border-gray-800">
                  <button onClick={() => setViewMode('profile')} className="p-2 -ml-2 hover:bg-gray-800 rounded-full">
                      <ChevronLeft size={24} />
                  </button>
                  <h2 className="text-lg font-bold ml-2">Configurações</h2>
            </div>
            
            <div className="p-4 space-y-2">
                {/* List Item 1 */}
                <button className="w-full flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-indigo-500/30 transition-colors">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400">
                            <Bell size={18} />
                        </div>
                        <span className="font-medium text-sm">Notificações</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-500" />
                </button>

                {/* List Item 2 */}
                <button className="w-full flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-indigo-500/30 transition-colors">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400">
                            <Shield size={18} />
                        </div>
                        <span className="font-medium text-sm">Privacidade & Segurança</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-500" />
                </button>

                 {/* List Item 3 */}
                 <button className="w-full flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-indigo-500/30 transition-colors">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400">
                            <HelpCircle size={18} />
                        </div>
                        <span className="font-medium text-sm">Ajuda & Suporte</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-500" />
                </button>
                
                {/* Logout Button */}
                {onLogout && (
                  <button 
                    onClick={onLogout}
                    className="w-full flex items-center justify-between p-4 bg-red-900/20 border border-red-900/30 rounded-xl hover:bg-red-900/30 transition-colors mt-8"
                  >
                      <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
                              <LogOut size={18} />
                          </div>
                          <span className="font-medium text-sm text-red-400">Sair da Conta</span>
                      </div>
                  </button>
                )}
            </div>
        </div>
      );
  }

  // --- Render: Edit Profile Screen ---
  if (viewMode === 'edit') {
      return (
          <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white animate-fade-in z-50 relative">
              {/* Header */}
              <div className="flex items-center justify-between p-4 pt-8">
                  <button onClick={() => setViewMode('profile')} className="p-2 hover:bg-white/10 rounded-full">
                      <ChevronLeft size={28} />
                  </button>
                  <h2 className="text-lg font-bold">Edit Profile</h2>
                  <div className="w-10"></div> {/* Spacer */}
              </div>

              <div className="px-6 pb-24 overflow-y-auto h-[calc(100vh-80px)]">
                  
                  {/* Avatar Edit */}
                  <div className="flex justify-center my-8">
                        <div className="relative">
                            <img 
                                src={editForm.avatar} 
                                alt={user.name} 
                                className="w-32 h-32 rounded-full border-4 border-blue-900 object-cover bg-gray-800"
                            />
                            <label className="absolute bottom-0 right-0 bg-white text-blue-900 p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-200 transition-colors">
                                <Camera size={20} />
                                {/* Hidden input simulation */}
                            </label>
                        </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-5 mt-4">
                      <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-300 ml-1">Name</label>
                          <input 
                              type="text" 
                              value={editForm.name}
                              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                          />
                      </div>

                      <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-300 ml-1">Email</label>
                          <input 
                              type="email" 
                              value={editForm.email}
                              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none transition-all"
                          />
                      </div>

                      <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-300 ml-1">Bio</label>
                          <textarea 
                              value={editForm.bio}
                              onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                              rows={3}
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none transition-all resize-none"
                          />
                      </div>

                      <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-300 ml-1">Date of Birth</label>
                          <div className="relative">
                            <input 
                                type="date" 
                                value={editForm.birthDate}
                                onChange={(e) => setEditForm({...editForm, birthDate: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none appearance-none"
                            />
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                          </div>
                      </div>

                      <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-300 ml-1">Country/Region</label>
                          <div className="relative">
                            <input 
                                type="text" 
                                value={editForm.location}
                                onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none"
                            />
                             <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                          </div>
                      </div>

                      <button 
                          onClick={handleSaveProfile}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl mt-4 shadow-lg shadow-blue-900/50 active:scale-95 transition-transform"
                      >
                          Save changes
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  // --- Render: Followers / Following List ---
  if (viewMode === 'followers' || viewMode === 'following') {
      const listTitle = viewMode === 'followers' ? 'Followers' : 'Following';
      // Filter list for 'following' tab if needed, but for demo we use the same list with different buttons
      const displayList = friendsList; 

      return (
          <div className="min-h-screen bg-black text-white animate-fade-in pb-24">
              <div className="flex items-center p-4 border-b border-gray-800 pt-8">
                  <button onClick={() => setViewMode('profile')} className="p-2 -ml-2 hover:bg-gray-800 rounded-full">
                      <ChevronLeft size={24} />
                  </button>
                  <h2 className="text-lg font-bold ml-2">{listTitle}</h2>
              </div>
              
              <div className="p-4">
                 <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-indigo-500 outline-none text-white"
                    />
                 </div>

                 <div className="space-y-4">
                     {displayList.map(friend => (
                         <div key={friend.id} className="flex items-center justify-between">
                             <div className="flex items-center space-x-3">
                                 <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full border border-gray-800 object-cover" />
                                 <div>
                                     <h3 className="font-bold text-sm">{friend.name}</h3>
                                     <p className="text-xs text-gray-500">{friend.points} points</p>
                                 </div>
                             </div>
                             <button 
                                onClick={() => handleToggleFollow(friend.id)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all active:scale-95 ${
                                    friend.isFollowing 
                                        ? 'border-gray-700 text-gray-400 bg-transparent' 
                                        : 'bg-indigo-600 text-white border-transparent'
                                }`}
                             >
                                 {friend.isFollowing ? 'Following' : 'Follow'}
                             </button>
                         </div>
                     ))}
                 </div>
              </div>
          </div>
      );
  }

  // --- Render: Main Profile ---
  return (
    <div className="bg-black min-h-screen text-white pb-24 animate-fade-in">
      
      {/* Top Actions Bar (No Banner) */}
      <div className="flex justify-end px-6 pt-8 pb-4">
        <button 
            onClick={() => setViewMode('settings')}
            className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white border border-gray-800 hover:bg-gray-800 transition-colors"
        >
            <Menu size={20} />
        </button>
      </div>

      {/* Profile Header Content */}
      <div className="px-4 relative">
        
        {/* Avatar - Centered */}
        <div className="flex justify-center mb-4">
             <div className="p-1 bg-black rounded-full relative">
                <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-900 bg-gray-800"
                />
                {/* Edit Icon on Avatar */}
                {isOwnProfile && (
                    <button 
                        onClick={() => setViewMode('edit')}
                        className="absolute bottom-2 right-2 bg-indigo-600 p-2 rounded-full border-4 border-black text-white hover:bg-indigo-500 transition-colors"
                    >
                        <Edit3 size={14} />
                    </button>
                )}
             </div>
        </div>

        {/* User Info */}
        <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-1">
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <CheckCircle size={18} className="text-blue-500 fill-blue-500/10" />
            </div>
            <p className="text-gray-400 text-sm font-medium whitespace-pre-line px-6">{user.bio}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8 max-w-xs mx-auto">
            <button 
                onClick={() => setViewMode('edit')}
                className={`flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-indigo-900/20 ${isOwnProfile ? 'w-full' : ''}`}
            >
                <Edit3 size={16} />
                <span>Editar Perfil</span>
            </button>
            
            {!isOwnProfile && (
                <button className="flex-1 bg-transparent border border-gray-700 hover:border-gray-500 text-white py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition-colors">
                    <MessageCircle size={16} />
                    <span>Mensagem</span>
                </button>
            )}
        </div>

        {/* Stats Cards Row */}
        <div className="flex justify-between gap-3 mb-8">
            <button className="flex-1 bg-gray-900/50 border border-gray-800 rounded-2xl p-3 text-center hover:border-indigo-500/30 transition-colors group">
                <span className="block text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">0</span>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Posts</span>
            </button>
            <button 
                onClick={() => setViewMode('followers')}
                className="flex-1 bg-gray-900/50 border border-gray-800 rounded-2xl p-3 text-center hover:border-indigo-500/30 transition-colors group">
                <span className="block text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{user.followers}</span>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Seguidores</span>
            </button>
            <button 
                onClick={() => setViewMode('following')}
                className="flex-1 bg-gray-900/50 border border-gray-800 rounded-2xl p-3 text-center hover:border-indigo-500/30 transition-colors group">
                <span className="block text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{user.following}</span>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Seguindo</span>
            </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex justify-between border-b border-gray-800 mb-6 px-2">
            {(['Feed', 'Awards', 'Gallery', 'Network'] as Tab[]).map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium transition-all relative ${
                        activeTab === tab 
                        ? 'text-white' 
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                >
                    {tab}
                    {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-t-full"></div>
                    )}
                </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="animate-slide-up min-h-[300px]">
            {activeTab === 'Feed' && (
                <div className="space-y-4">
                     {/* Monthly Check-ins Chart */}
                     <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center space-x-2">
                                <BarChart3 size={18} className="text-indigo-500"/>
                                <h3 className="text-sm font-bold text-gray-200">Média de Check-ins Mensais</h3>
                            </div>
                            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-md font-bold">2024</span>
                        </div>
                        
                        <div className="flex items-end justify-between h-40 space-x-2 pt-4 pb-2">
                        {monthlyStats.map((stat, i) => (
                            <div key={i} className="flex flex-col items-center w-full h-full justify-end group">
                                    {/* Tooltip/Value */}
                                    <div className="mb-2 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 px-1.5 py-0.5 rounded transform translate-y-1">
                                        {stat.value}
                                    </div>
                                    
                                    {/* Bar */}
                                    <div className="w-full h-full flex flex-col justify-end relative">
                                         <div 
                                            className="w-full bg-gradient-to-t from-indigo-700 to-indigo-500 rounded-t-sm rounded-b-[2px] opacity-80 group-hover:opacity-100 transition-all duration-300 hover:shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                                            style={{ height: stat.height }} 
                                         />
                                    </div>

                                    {/* Month Label */}
                                    <span className="text-[10px] text-gray-500 font-medium mt-3 uppercase tracking-wide">{stat.month}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'Awards' && (
                <div className="space-y-3">
                     {user.achievements.map((achievement) => (
                        <div
                        key={achievement.id}
                        className={`flex items-center p-4 rounded-2xl border transition-colors ${
                            achievement.unlocked
                            ? 'bg-gray-900 border-indigo-500/30'
                            : 'bg-gray-900/50 border-gray-800 opacity-60'
                        }`}
                        >
                        <div className={`p-3 rounded-xl mr-4 ${achievement.unlocked ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-800 text-gray-500'}`}>
                            {getIcon(achievement.icon)}
                        </div>
                        <div className="flex-1">
                            <h4 className={`font-bold text-sm ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                            {achievement.title}
                            </h4>
                            <p className="text-xs text-gray-400 mt-0.5">{achievement.description}</p>
                        </div>
                        {achievement.unlocked && <Medal className="text-amber-400 ml-2" size={16} />}
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'Gallery' && (
                 <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <ImageIcon size={48} className="mb-3 opacity-50" />
                    <p className="text-sm">Galeria vazia</p>
                 </div>
            )}

            {activeTab === 'Network' && (
                 <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <Users size={48} className="mb-3 opacity-50" />
                    <p className="text-sm">Nenhuma conexão recente</p>
                 </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default Profile;