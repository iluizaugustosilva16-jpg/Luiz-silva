import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post, Comment } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { toggleLike, addComment, deletePost } from '../lib/db';
import { HeartIcon, HeartIconSolid, ChatBubbleIcon, ShareIcon, TrashIcon } from './Icons';

interface PostCardProps {
  post: Post;
  onPostUpdate: () => void; // Callback to refresh the feed
}

const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdate }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const isLikedByCurrentUser = currentUser ? post.likedBy.includes(currentUser.id) : false;
  const isOwner = currentUser ? post.user.id === currentUser.id : false;

  const handleLike = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    toggleLike(post.id, currentUser.id);
    onPostUpdate();
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (newComment.trim()) {
      addComment(post.id, currentUser.id, newComment.trim());
      setNewComment('');
      onPostUpdate();
    }
  };
  
  const handleDelete = () => {
    if (!currentUser || !isOwner) return;
    if (window.confirm("Are you sure you want to delete this post?")) {
        deletePost(post.id, currentUser.id);
        onPostUpdate();
    }
  }

  return (
    <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
      {/* Post Header */}
      <div className="flex items-center p-3">
        <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full object-cover" />
        <div className="ml-3">
          <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{post.user.name}</p>
           <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(post.timestamp).toLocaleString()}</p>
        </div>
        {isOwner && (
             <button onClick={handleDelete} className="ml-auto text-gray-500 dark:text-gray-400 hover:text-red-500 p-2">
                <TrashIcon className="w-5 h-5" />
             </button>
        )}
      </div>

      {/* Post Image */}
      <img src={post.image} alt="Post content" className="w-full h-auto" />

      {/* Post Actions */}
      <div className="flex justify-between items-center p-3">
        <div className="flex items-center space-x-4">
          <button onClick={handleLike} className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors">
            {isLikedByCurrentUser ? <HeartIconSolid className="w-6 h-6 text-red-500" /> : <HeartIcon className="w-6 h-6" />}
            <span className="text-sm">{post.likedBy.length.toLocaleString()}</span>
          </button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-400 transition-colors">
            <ChatBubbleIcon className="w-6 h-6" />
            <span className="text-sm">{post.comments.length.toLocaleString()}</span>
          </button>
        </div>
        <button className="text-gray-600 dark:text-gray-300 hover:text-fuchsia-400 transition-colors">
            <ShareIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Post Caption */}
      <div className="px-3 pb-2">
        <p className="text-sm">
          <span className="font-bold mr-2">{post.user.handle}</span>
          {post.caption}
        </p>
        {post.comments.length > 0 && (
             <button onClick={() => setShowComments(!showComments)} className="text-xs text-gray-500 mt-1">
                {showComments ? 'Hide comments' : `View all ${post.comments.length} comments`}
            </button>
        )}
      </div>

       {/* Comments Section */}
      {showComments && (
        <div className="px-3 pb-3 border-t border-gray-200 dark:border-gray-800 pt-2">
          <div className="max-h-40 overflow-y-auto space-y-2 mb-2">
            {post.comments.map(comment => (
              <div key={comment.id} className="flex items-start text-sm">
                <img src={comment.user.avatar} alt={comment.user.name} className="w-6 h-6 rounded-full mr-2 mt-0.5" />
                <div>
                  <span className="font-bold mr-2">{comment.user.name}</span>
                  <span>{comment.text}</span>
                </div>
              </div>
            ))}
          </div>
          {currentUser && (
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 mt-2">
              <img src={currentUser.avatar} alt="My avatar" className="w-8 h-8 rounded-full" />
              <input 
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full py-1.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
              />
              <button type="submit" className="text-fuchsia-500 dark:text-fuchsia-400 font-semibold text-sm disabled:text-gray-400 dark:disabled:text-gray-500" disabled={!newComment.trim()}>Post</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;