import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import AddPostPage from './pages/AddPostPage';
import LoginPage from './pages/LoginPage';
import EditProfilePage from './pages/EditProfilePage';
import AccountPage from './pages/AccountPage';

const App: React.FC = () => {
  return (
    <ThemeProvider>
        <AuthProvider>
            <div className="w-screen h-screen md:w-[420px] md:h-[800px] bg-white dark:bg-black text-gray-900 dark:text-white font-sans overflow-hidden md:rounded-3xl shadow-2xl shadow-purple-500/20 flex flex-col relative">
                <main className="flex-1 overflow-y-auto pb-20">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/profile/:userId" element={<ProfilePage />} />
                        <Route path="/add" element={<AddPostPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/edit-profile" element={<EditProfilePage />} />
                        <Route path="/account" element={<AccountPage />} />
                        <Route path="/search" element={<PlaceholderPage title="Search" />} />
                        <Route path="/direct" element={<PlaceholderPage title="Direct Messages" />} />
                    </Routes>
                </main>
                <BottomNav />
            </div>
        </AuthProvider>
    </ThemeProvider>
  );
};

// A simple placeholder component for unimplemented pages
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex items-center justify-center h-full">
        <h1 className="text-2xl font-bold text-gray-400 dark:text-gray-500">{title}</h1>
    </div>
);


export default App;