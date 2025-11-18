import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPosts } from '../lib/db';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import StoryCarousel from '../components/StoryCarousel';
import ThemeToggleButton from '../components/ThemeToggleButton';
import { UserCircleIcon } from '../components/Icons';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const location = useLocation();
  const { currentUser } = useAuth();

  const fetchPosts = useCallback(() => {
    setPosts(getPosts());
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [location, fetchPosts]);

  return (
    <div className="bg-gray-50 dark:bg-black min-h-full">
      <header className="sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-purple-500">
            AuraConnect
        </h1>
        <div className="flex items-center space-x-2">
            <ThemeToggleButton />
            <Link to={currentUser ? "/profile" : "/login"}>
                {currentUser ? (
                     <img src={currentUser.avatar} alt="My Profile" className="w-8 h-8 rounded-full border-2 border-fuchsia-500" />
                ) : (
                    <UserCircleIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                )}
            </Link>
        </div>
      </header>
      <StoryCarousel />
      <div className="flex flex-col">
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard key={post.id} post={post} onPostUpdate={fetchPosts} />
          ))
        ) : (
          <div className="text-center p-10 text-gray-500">
            <p>No posts yet.</p>
            <p>Be the first to share something!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;