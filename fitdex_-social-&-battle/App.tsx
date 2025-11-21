import React, { useState, useEffect } from 'react';
import { User, AppView } from './types';
import { INITIAL_USER, MOCK_FRIENDS } from './constants';
import { authService } from './services/authService';
import Navigation from './components/Navigation';
import Profile from './components/Profile';
import Training from './components/Training';
import Battle from './components/Battle';
import Social from './components/Social';
import Home from './components/Home';
import Recipes from './components/Recipes';
import CalorieCalculator from './components/CalorieCalculator';
import FriendsList from './components/FriendsList';
import Achievements from './components/Achievements';
import Login from './components/Login';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      setCurrentUser(savedUser);
    }
    setLoadingAuth(false);
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setCurrentView(AppView.HOME);
  };

  const handleScoreUpdate = (pointsToAdd: number) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      points: currentUser.points + pointsToAdd,
      level: Math.floor((currentUser.points + pointsToAdd) / 1000) + 1
    };
    
    setCurrentUser(updatedUser);
    authService.updateUser(updatedUser);
  };

  const handleUpdateUser = (updatedData: Partial<User>) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      ...updatedData
    };

    setCurrentUser(updatedUser);
    authService.updateUser(updatedUser);
  };

  if (loadingAuth) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Carregando...</div>;
  }

  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
        return (
            <Home 
                user={currentUser} 
                onNavigate={setCurrentView}
            />
        );
      case AppView.PROFILE:
        return (
            <Profile 
                user={currentUser} 
                onUpdateProfile={handleUpdateUser}
                isOwnProfile={true}
                onLogout={handleLogout}
            />
        );
      case AppView.TRAINING:
        return <Training />;
      case AppView.BATTLE:
        return (
            <Battle 
                user={currentUser}
                friends={MOCK_FRIENDS}
                onScoreUpdate={handleScoreUpdate} 
            />
        );
      case AppView.SOCIAL:
      case AppView.CHAT:
        return (
          <Social 
            user={currentUser} 
            friends={MOCK_FRIENDS} 
            onNavigate={setCurrentView} 
          />
        );
      case AppView.FRIENDS:
        return (
          <FriendsList 
            friends={MOCK_FRIENDS}
            onNavigate={setCurrentView}
          />
        );
      case AppView.RECIPES:
        return <Recipes onBack={() => setCurrentView(AppView.HOME)} />;
      case AppView.CALCULATOR:
        return <CalorieCalculator onBack={() => setCurrentView(AppView.HOME)} />;
      case AppView.ACHIEVEMENTS:
        return <Achievements achievements={currentUser.achievements} onBack={() => setCurrentView(AppView.HOME)} />;
      default:
        return <Home user={currentUser} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-indigo-500/30">
      <main className="max-w-md mx-auto min-h-screen relative bg-black shadow-2xl overflow-hidden">
        {renderView()}
        <Navigation currentView={currentView} onNavigate={setCurrentView} />
      </main>
    </div>
  );
};

export default App;