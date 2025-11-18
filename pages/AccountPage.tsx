import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeftIcon } from '../components/Icons';
import { updateUser } from '../lib/db';

const AccountPage: React.FC = () => {
    const { currentUser, logout, refreshCurrentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/login', { replace: true });
        }
    }, [currentUser, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    const handleVisibilityChange = (isPrivate: boolean) => {
        if (!currentUser) return;
        // Fix: Explicitly type 'newVisibility' to match the 'User' type.
        const newVisibility: 'public' | 'private' = isPrivate ? 'private' : 'public';
        const updatedUser = { ...currentUser, visibility: newVisibility };
        updateUser(updatedUser);
        refreshCurrentUser();
    };


    if (!currentUser) {
        return null; // Or a loading spinner
    }

    return (
        <div className="bg-gray-50 dark:bg-black min-h-full text-gray-900 dark:text-white">
            <header className="sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10 flex items-center p-4 border-b border-gray-200 dark:border-gray-800">
                <button onClick={() => navigate(-1)} className="p-2">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold mx-auto">Account</h1>
                <div className="w-8"></div> {/* Spacer */}
            </header>
            
            <div className="p-4 flex flex-col items-center">
                <div className="text-center w-full max-w-xs">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">You are logged in as:</p>
                    <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm w-full">
                        <img src={currentUser.avatar} alt={currentUser.name} className="w-16 h-16 rounded-full object-cover mb-3" />
                        <div>
                            <p className="font-bold text-lg">{currentUser.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">@{currentUser.handle}</p>
                        </div>
                    </div>
                </div>

                {/* Settings Section */}
                <div className="mt-8 w-full max-w-xs space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-left">Settings</h2>
                    <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                        <label htmlFor="private-profile-toggle" className="font-medium text-gray-900 dark:text-white cursor-pointer">
                            Private Profile
                        </label>
                        <label htmlFor="private-profile-toggle" className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                id="private-profile-toggle"
                                className="sr-only peer"
                                checked={currentUser.visibility === 'private'}
                                onChange={(e) => handleVisibilityChange(e.target.checked)}
                                aria-describedby="private-profile-description"
                            />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-fuchsia-500"></div>
                        </label>
                    </div>
                    <p id="private-profile-description" className="text-xs text-gray-500 dark:text-gray-400 px-1">
                        When your profile is private, only people you approve can see your photos and videos.
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="mt-8 w-full max-w-xs py-3 font-semibold rounded-lg bg-red-500 hover:bg-red-600 transition-colors text-white"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AccountPage;