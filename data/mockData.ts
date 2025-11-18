
import { User, Story, Post } from '../types';

export const users: User[] = [
  { id: 'u1', name: 'Anne Adams', handle: 'anne.adams99', avatar: 'https://picsum.photos/seed/anne/100/100', bio: 'Digital artist & coffee enthusiast. Exploring the intersection of technology and creativity. ✨', stats: { fans: '2', following: '2', posts: '2129' }, followingIds: ['u2', 'u4'], followerIds: ['u3', 'u5'], visibility: 'public' },
  { id: 'u2', name: 'Krista Artis', handle: 'krista_artis', avatar: 'https://picsum.photos/seed/krista/100/100', bio: 'Photographer capturing moments from around the world. Based in NYC.', stats: { fans: '1', following: '2', posts: '980' }, followingIds: ['u3', 'u4'], followerIds: ['u1'], visibility: 'public' },
  { id: 'u3', name: 'Imogen', handle: 'imogen_art', avatar: 'https://picsum.photos/seed/imogen/100/100', bio: 'Illustrator and storyteller. Bringing characters to life with a splash of color.', stats: { fans: '2', following: '1', posts: '1.2K' }, followingIds: ['u1'], followerIds: ['u2', 'u5'], visibility: 'public' },
  { id: 'u4', name: 'Sarah Jones', handle: 'sarah_j', avatar: 'https://picsum.photos/seed/sarah/100/100', bio: 'Fitness coach and lifestyle blogger. Helping you be the best version of yourself.', stats: { fans: '2', following: '0', posts: '450' }, followingIds: [], followerIds: ['u1', 'u2'], visibility: 'public' },
  { id: 'u5', name: 'Alex Doe', handle: 'alex_doe', avatar: 'https://picsum.photos/seed/alex/100/100', bio: 'Tech lover, gamer, and part-time philosopher.', stats: { fans: '0', following: '2', posts: '150' }, followingIds: ['u1', 'u3'], followerIds: [], visibility: 'public' },
];

export const mainUser = users[0];

export const stories: Story[] = users.map(user => ({
  id: `s-${user.id}`,
  user: {
    id: user.id,
    name: user.name.split(' ')[0],
    avatar: user.avatar,
  },
}));

export const posts: Post[] = [
  { id: 'p1', user: users[3], image: 'https://picsum.photos/seed/post1/500/600', caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.', likedBy: [], comments: [], timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
  { id: 'p2', user: users[1], image: 'https://picsum.photos/seed/post2/500/500', caption: 'Exploring new horizons and vibrant colors.', likedBy: ['u1', 'u3'], comments: [], timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: 'p3', user: users[2], image: 'https://picsum.photos/seed/post3/500/700', caption: 'A moment of quiet reflection.', likedBy: [], comments: [], timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: 'p4', user: users[0], image: 'https://picsum.photos/seed/post4/500/500', caption: 'My latest digital creation. What do you think?', likedBy: ['u2', 'u3', 'u4'], comments: [], timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
];

export const userPosts: string[] = [
    'https://picsum.photos/seed/gallery1/400/400',
    'https://picsum.photos/seed/gallery2/400/400',
    'https://picsum.photos/seed/gallery3/400/400',
    'https://picsum.photos/seed/gallery4/400/400',
    'https://picsum.photos/seed/gallery5/400/400',
    'https://picsum.photos/seed/gallery6/400/400',
];