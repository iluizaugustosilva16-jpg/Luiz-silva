import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, SearchIcon, PlusCircleIcon, PaperAirplaneIcon, UserCircleIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';

const BottomNav: React.FC = () => {
  const { currentUser } = useAuth();

  const navItems = [
    { to: '/', icon: HomeIcon, label: 'Home' },
    { to: '/search', icon: SearchIcon, label: 'Search' },
    { to: '/add', icon: PlusCircleIcon, label: 'Add', isSpecial: true },
    { to: '/direct', icon: PaperAirplaneIcon, label: 'Direct' },
    { to: '/profile', icon: UserCircleIcon, label: 'Profile' },
  ];

  const activeLink = 'text-fuchsia-400';
  const inactiveLink = 'text-gray-400 dark:text-gray-500 hover:text-fuchsia-400 dark:hover:text-fuchsia-300 transition-colors';

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white/50 dark:bg-black/50 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          if (item.isSpecial) {
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className="flex items-center justify-center -mt-6"
              >
                <div className="bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full p-2 shadow-lg shadow-fuchsia-500/30">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
              </NavLink>
            );
          }
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) => (isActive ? activeLink : inactiveLink)}
            >
              <item.icon className="w-7 h-7" />
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;