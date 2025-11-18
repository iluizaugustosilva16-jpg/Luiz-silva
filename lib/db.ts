import { users, posts as mockPosts } from '../data/mockData';
import { Post, User, Comment } from '../types';

const USERS_KEY = 'aura_connect_users';
const POSTS_KEY = 'aura_connect_posts';

// --- Initialize DB ---
export const initializeDB = () => {
  const usersJson = localStorage.getItem(USERS_KEY);
  if (!usersJson) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } else {
    // Add new fields to users if they don't exist from older versions
    let storedUsers = JSON.parse(usersJson);
    let needsUpdate = false;
    storedUsers.forEach((user: User) => {
        if (user.followingIds === undefined) {
            user.followingIds = [];
            needsUpdate = true;
        }
        if (user.followerIds === undefined) {
            user.followerIds = [];
            needsUpdate = true;
        }
        if (user.visibility === undefined) {
            user.visibility = 'public';
            needsUpdate = true;
        }
    });
    if (needsUpdate) {
        localStorage.setItem(USERS_KEY, JSON.stringify(storedUsers));
    }
  }

  // Add new fields to posts if they don't exist from older versions
  const postsJson = localStorage.getItem(POSTS_KEY);
  if (!postsJson) {
      localStorage.setItem(POSTS_KEY, JSON.stringify(mockPosts));
  } else {
      let posts = JSON.parse(postsJson);
      let needsUpdate = false;
      posts.forEach((post: Post) => {
          if (post.likedBy === undefined) {
              post.likedBy = [];
              needsUpdate = true;
          }
          if (post.comments === undefined) {
              post.comments = [];
              needsUpdate = true;
          }
      });
      if (needsUpdate) {
          localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
      }
  }
};

// --- Helper Functions ---
const formatCount = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
};


// --- User Functions ---
export const getUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

export const getUserById = (userId: string): User | undefined => {
    return getUsers().find(u => u.id === userId);
}

export const updateUser = (updatedUser: User) => {
  let allUsers = getUsers();
  const userIndex = allUsers.findIndex(u => u.id === updatedUser.id);
  if (userIndex > -1) {
    allUsers[userIndex] = updatedUser;
    localStorage.setItem(USERS_KEY, JSON.stringify(allUsers));
  }
};

export const toggleFollow = (currentUserId: string, targetUserId: string) => {
    let allUsers = getUsers();
    const currentUserIndex = allUsers.findIndex(u => u.id === currentUserId);
    const targetUserIndex = allUsers.findIndex(u => u.id === targetUserId);

    if (currentUserIndex === -1 || targetUserIndex === -1) return;

    const currentUser = allUsers[currentUserIndex];
    const targetUser = allUsers[targetUserIndex];

    const isFollowing = currentUser.followingIds.includes(targetUserId);

    if (isFollowing) {
        // Unfollow
        currentUser.followingIds = currentUser.followingIds.filter(id => id !== targetUserId);
        targetUser.followerIds = targetUser.followerIds.filter(id => id !== currentUserId);
    } else {
        // Follow
        currentUser.followingIds.push(targetUserId);
        targetUser.followerIds.push(currentUserId);
    }

    // Update stats
    currentUser.stats.following = formatCount(currentUser.followingIds.length);
    targetUser.stats.fans = formatCount(targetUser.followerIds.length);
    
    // Save updated users
    localStorage.setItem(USERS_KEY, JSON.stringify(allUsers));
};


// --- Post Functions ---
const getAllPosts = (): Post[] => {
  const postsJson = localStorage.getItem(POSTS_KEY);
  return postsJson ? JSON.parse(postsJson) : [];
}

const saveAllPosts = (posts: Post[]) => {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export const getPosts = (): Post[] => {
  const allPosts: Post[] = getAllPosts();
  return allPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const addPost = (newPostData: { image: string; caption: string; userId: string }) => {
  const user = getUserById(newPostData.userId);
  if (!user) throw new Error("User not found to create post");

  const allPosts = getAllPosts();

  const newPost: Post = {
    id: `p_${Date.now()}`,
    user: {
        id: user.id,
        name: user.name,
        handle: user.handle,
        avatar: user.avatar,
    },
    image: newPostData.image,
    caption: newPostData.caption,
    likedBy: [],
    comments: [],
    timestamp: new Date().toISOString(),
  };

  saveAllPosts([newPost, ...allPosts]);
};

export const deletePost = (postId: string, userId: string): boolean => {
    let allPosts = getAllPosts();
    const postIndex = allPosts.findIndex(p => p.id === postId);

    if (postIndex === -1 || allPosts[postIndex].user.id !== userId) {
        // Post not found or user is not the owner
        return false;
    }

    allPosts.splice(postIndex, 1);
    saveAllPosts(allPosts);
    return true;
}

export const toggleLike = (postId: string, userId: string) => {
    let allPosts = getAllPosts();
    const post = allPosts.find(p => p.id === postId);
    if (!post) return;

    const likeIndex = post.likedBy.indexOf(userId);
    if (likeIndex > -1) {
        post.likedBy.splice(likeIndex, 1); // Unlike
    } else {
        post.likedBy.push(userId); // Like
    }
    saveAllPosts(allPosts);
};

export const addComment = (postId: string, userId: string, text: string) => {
    const user = getUserById(userId);
    if (!user) return;
    
    let allPosts = getAllPosts();
    const post = allPosts.find(p => p.id === postId);
    if (!post) return;

    const newComment: Comment = {
        id: `c_${Date.now()}`,
        text,
        user: { id: user.id, name: user.name, avatar: user.avatar },
        timestamp: new Date().toISOString(),
    };
    post.comments.push(newComment);
    saveAllPosts(allPosts);
};


export const getPostsByUserId = (userId: string): Post[] => {
    const allPosts = getPosts();
    return allPosts.filter(post => post.user.id === userId);
}