import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUsers } from '../lib/db';
import { User } from '../types';

const LoginPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const handleSelectUser = (userId: string) => {
    login(userId);
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-purple-500 mb-2">
            AuraConnect
        </h1>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Select an account</h2>
        <div className="space-y-3">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleSelectUser(user.id)}
              className="w-full flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg text-left hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow"
            >
              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
              <div className="ml-4">
                <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">@{user.handle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;