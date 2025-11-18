export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio?: string;
  visibility?: 'public' | 'private';
  stats: {
    fans: string;
    following: string;
    posts: string;
  };
  followingIds: string[];
  followerIds: string[];
}

export interface Story {
  id: string;
  user: Pick<User, 'id' | 'name' | 'avatar'>;
}

export interface Comment {
    id: string;
    text: string;
    user: Pick<User, 'id' | 'name' | 'avatar'>;
    timestamp: string; // ISO 8601 date string
}

export interface Post {
  id: string;
  user: Pick<User, 'id' | 'name' | 'avatar' | 'handle'>;
  image: string;
  caption: string;
  likedBy: string[]; // Array of user IDs
  comments: Comment[];
  timestamp: string; // ISO 8601 date string
}