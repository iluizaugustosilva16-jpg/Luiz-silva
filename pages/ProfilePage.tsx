import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getPostsByUserId, getUserById, toggleFollow } from '../lib/db';
import { Post, User } from '../types';
import { ArrowLeftIcon, LockClosedIcon, CogIcon } from '../components/Icons';
import { useAuth } from '../contexts/AuthContext';

interface ProfileHeaderProps {
    user: User;
    isCurrentUserProfile: boolean;
    isFollowing: boolean;
    onFollowToggle: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, isCurrentUserProfile, isFollowing, onFollowToggle }) => {
    const navigate = useNavigate();
    return (
        <div className="relative p-4 text-gray-900 dark:text-white">
            <div className="absolute top-4 left-4">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-black/20 dark:bg-black/30 hover:bg-black/40 dark:hover:bg-black/50 transition-colors text-white">
                    <ArrowLeftIcon className="w-5 h-5" />
                </button>
            </div>
            {isCurrentUserProfile && (
                 <Link to="/account" className="absolute top-4 right-4 p-2 rounded-full bg-black/20 dark:bg-black/30 hover:bg-black/40 dark:hover:bg-black/50 transition-colors text-white">
                    <CogIcon className="w-5 h-5" />
                 </Link>
            )}
            <div className="pt-12 flex flex-col items-center text-center">
                <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-4 border-white dark:border-black object-cover shadow-lg" />
                <h1 className="text-2xl font-bold mt-3">{user.name}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">@{user.handle}</p>
                <div className="flex justify-center space-x-6 my-4">
                    <div>
                        <p className="text-xl font-bold">{user.stats.fans}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Fans</p>
                    </div>
                    <div>
                        <p className="text-xl font-bold">{user.stats.following}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Following</p>
                    </div>
                    <div>
                        <p className="text-xl font-bold">{user.stats.posts}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Posts</p>
                    </div>
                </div>
                 {isCurrentUserProfile ? (
                    <Link to="/edit-profile" className="w-full py-3 font-semibold rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white">
                        Edit Profile
                    </Link>
                ) : isFollowing ? (
                    <button onClick={onFollowToggle} className="w-full py-3 font-semibold rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white">
                        Unfollow
                    </button>
                ) : (
                    <button onClick={onFollowToggle} className="w-full py-3 font-semibold rounded-lg bg-gradient-to-r from-fuchsia-500 to-blue-500 hover:opacity-90 transition-opacity text-white">
                        Follow
                    </button>
                )}
            </div>
        </div>
    );
};

const ProfileTabs: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
    const tabs = ['Photo', 'Video', 'About', 'Favorite'];
    return (
        <div className="border-b border-gray-200 dark:border-gray-800">
            <nav className="flex justify-around">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-3 px-2 text-sm font-medium ${
                            activeTab === tab 
                                ? 'text-fuchsia-500 dark:text-fuchsia-400 border-b-2 border-fuchsia-500 dark:border-fuchsia-400' 
                                : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </nav>
        </div>
    );
};

const PhotoGrid: React.FC<{posts: Post[]}> = ({ posts }) => (
    <div className="grid grid-cols-3 gap-0.5">
        {posts.map((post, index) => (
            <div key={post.id} className="aspect-square bg-gray-200 dark:bg-gray-800">
                <img src={post.image} alt={`Post ${index + 1}`} className="w-full h-full object-cover" />
            </div>
        ))}
    </div>
);


const ProfilePage: React.FC = () => {
    const { currentUser, refreshCurrentUser } = useAuth();
    const { userId } = useParams<{ userId?: string }>();
    const navigate = useNavigate();
    
    const [user, setUser] = useState<User | null>(null);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [activeTab, setActiveTab] = useState('Photo');
    const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);

    useEffect(() => {
        const profileId = userId || currentUser?.id;

        if (!profileId) {
            navigate('/login');
            return;
        }

        const profileUser = getUserById(profileId);
        
        if (profileUser) {
            setUser(profileUser);
            setUserPosts(getPostsByUserId(profileUser.id));
            setIsCurrentUserProfile(currentUser?.id === profileUser.id);
        } else {
            navigate('/'); // User not found, redirect to home
        }
    }, [userId, currentUser, navigate]);

    if (!user) {
        return (
            <div className="bg-white dark:bg-black min-h-full flex items-center justify-center">
                <p className="text-gray-500">Loading profile...</p>
            </div>
        );
    }

    const isFollowing = currentUser?.followingIds?.includes(user.id) ?? false;
    const isProfilePrivate = user.visibility === 'private';
    const canViewProfile = !isProfilePrivate || isCurrentUserProfile;

    const handleFollowToggle = () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        toggleFollow(currentUser.id, user.id);
        refreshCurrentUser(); // This will update currentUser from AuthContext
        const updatedProfileUser = getUserById(user.id); // Re-fetch profile user
        if (updatedProfileUser) {
            setUser(updatedProfileUser);
        }
    };


    return (
        <div className="bg-gray-50 dark:bg-black min-h-full">
            <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-purple-300/50 to-transparent dark:from-purple-900/50 -z-0"></div>
            <div className="relative z-10">
                <ProfileHeader 
                    user={user} 
                    isCurrentUserProfile={isCurrentUserProfile} 
                    isFollowing={isFollowing}
                    onFollowToggle={handleFollowToggle}
                />
                
                {canViewProfile ? (
                    <>
                        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                        {activeTab === 'Photo' && <PhotoGrid posts={userPosts} />}
                        {activeTab === 'About' && (
                            <div className="p-6 text-gray-700 dark:text-gray-300">
                                <p className="whitespace-pre-wrap leading-relaxed">{user.bio || 'This user hasn\'t written a bio yet.'}</p>
                            </div>
                         )}
                         {activeTab !== 'Photo' && activeTab !== 'About' && (
                            <div className="p-10 text-center text-gray-500">
                               Content for {activeTab} goes here.
                            </div>
                         )}
                    </>
                ) : (
                    <div className="border-t border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center p-10 text-center">
                        <LockClosedIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">This Account is Private</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Follow this account to see their photos and videos.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;