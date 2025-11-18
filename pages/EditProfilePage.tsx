import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { updateUser } from '../lib/db';
import { ArrowLeftIcon } from '../components/Icons';

const EditProfilePage: React.FC = () => {
  const { currentUser, refreshCurrentUser } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      setName(currentUser.name);
      setHandle(currentUser.handle);
      setAvatar(currentUser.avatar);
      setBio(currentUser.bio || '');
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setIsLoading(true);

    const updatedUserData = {
        ...currentUser,
        name,
        handle,
        avatar,
        bio,
    };

    updateUser(updatedUserData);
    refreshCurrentUser();
    
    setIsLoading(false);
    navigate(`/profile`);
  };
  
  if (!currentUser) {
    return <div className="bg-white dark:bg-black min-h-full flex items-center justify-center"><p className="text-gray-500">Redirecting...</p></div>;
  }

  return (
    <div className="bg-gray-50 dark:bg-black min-h-full text-gray-900 dark:text-white">
      <header className="sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Edit Profile</h1>
        <button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="font-bold text-fuchsia-500 dark:text-fuchsia-400 disabled:text-gray-400"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </header>
      
      <form className="p-4 space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center space-y-2">
            <img src={avatar} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700" />
            <div className="w-full">
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Avatar URL</label>
                <input
                    id="avatar"
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-fuchsia-500 focus:border-fuchsia-500 transition"
                />
            </div>
        </div>

        <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-fuchsia-500 focus:border-fuchsia-500 transition"
            />
        </div>

        <div>
            <label htmlFor="handle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Handle</label>
            <input
                id="handle"
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-fuchsia-500 focus:border-fuchsia-500 transition"
            />
        </div>

        <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
            <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full h-28 p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-fuchsia-500 focus:border-fuchsia-500 transition"
                placeholder="Tell everyone a little about yourself..."
            />
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
