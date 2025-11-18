import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getUserById } from '../lib/db';

const AUTH_USER_ID_KEY = 'aura_connect_auth_user_id';

interface AuthContextType {
  currentUser: User | null;
  login: (userId: string) => void;
  logout: () => void;
  refreshCurrentUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // On initial load, check if a user was previously logged in
    const storedUserId = localStorage.getItem(AUTH_USER_ID_KEY);
    if (storedUserId) {
      const user = getUserById(storedUserId);
      if (user) {
        setCurrentUser(user);
      }
    }
  }, []);

  const login = (userId: string) => {
    const user = getUserById(userId);
    if (user) {
      localStorage.setItem(AUTH_USER_ID_KEY, userId);
      setCurrentUser(user);
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_USER_ID_KEY);
    setCurrentUser(null);
  };

  const refreshCurrentUser = () => {
    const storedUserId = localStorage.getItem(AUTH_USER_ID_KEY);
    if (storedUserId) {
        const user = getUserById(storedUserId);
        if (user) {
            setCurrentUser(user);
        }
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, refreshCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};