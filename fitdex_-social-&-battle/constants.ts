import { Achievement, Friend, TrainingGoal, User } from './types';

export const INITIAL_USER: User = {
  id: 'u1',
  name: 'Melissa Peters',
  avatar: 'https://picsum.photos/150/150',
  coverPhoto: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
  bio: 'Apaixonado por superação e tecnologia. 🏋️‍♂️🚀\nBuscando minha melhor versão a cada dia. #NoPainNoGain',
  level: 12,
  points: 2450,
  followers: 128,
  following: 45,
  goal: TrainingGoal.HYPERTROPHY,
  email: 'melpeters@gmail.com',
  location: 'São Paulo, BR',
  birthDate: '1995-05-23',
  achievements: [
    {
      id: 'a1',
      title: 'Monstro do Supino',
      description: 'Levantou 100kg no supino',
      icon: 'Dumbbell',
      category: 'Gym',
      unlocked: true,
      progress: 100,
      maxProgress: 100
    },
    {
      id: 'a2',
      title: 'Maratonista',
      description: 'Correu 42km acumulados',
      icon: 'Footprints',
      category: 'Run',
      unlocked: false,
      progress: 32,
      maxProgress: 42
    },
    {
      id: 'a3',
      title: 'Rei da Montanha',
      description: 'Subiu 1000m de elevação na bike',
      icon: 'Bike',
      category: 'Cycle',
      unlocked: true,
      progress: 1000,
      maxProgress: 1000
    },
    {
      id: 'a4',
      title: 'Gladiador',
      description: 'Venceu 5 batalhas PvP',
      icon: 'Swords',
      category: 'Battle',
      unlocked: true,
      progress: 5,
      maxProgress: 5
    },
    {
      id: 'a5',
      title: 'Apostador',
      description: 'Acumulou 500 pontos no modo Solo',
      icon: 'Diamond',
      category: 'Battle',
      unlocked: false,
      progress: 350,
      maxProgress: 500
    },
    {
      id: 'a6',
      title: 'Disciplina de Ferro',
      description: 'Fez check-in 7 dias seguidos',
      icon: 'CalendarCheck',
      category: 'Gym',
      unlocked: true,
      progress: 7,
      maxProgress: 7
    },
    {
      id: 'a7',
      title: 'Velocista',
      description: 'Correu 5km em menos de 25min',
      icon: 'Timer',
      category: 'Run',
      unlocked: false,
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'a8',
      title: 'Ascensão Dourada',
      description: 'Chegue na Arena Ouro (150 troféus)',
      icon: 'Trophy',
      category: 'Battle',
      unlocked: true,
      progress: 150,
      maxProgress: 150
    },
    {
      id: 'a9',
      title: 'Guerreiro de Prata',
      description: 'Chegue na Arena Prata (350 troféus)',
      icon: 'Shield',
      category: 'Battle',
      unlocked: true,
      progress: 350,
      maxProgress: 350
    },
    {
      id: 'a10',
      title: 'Lenda Diamante',
      description: 'Chegue na Arena Diamante (600 troféus)',
      icon: 'Diamond',
      category: 'Battle',
      unlocked: true,
      progress: 600,
      maxProgress: 600
    }
  ],
};

export const MOCK_FRIENDS: Friend[] = [
  { id: 'f1', name: 'Carlos Silva', avatar: 'https://picsum.photos/151/151', points: 3100, isOnline: true, isFollowing: true },
  { id: 'f2', name: 'Ana Souza', avatar: 'https://picsum.photos/152/152', points: 2800, isOnline: false, isFollowing: true },
  { id: 'f3', name: 'Pedro Santos', avatar: 'https://picsum.photos/153/153', points: 2100, isOnline: true, isFollowing: false },
  { id: 'f4', name: 'Mariana Lima', avatar: 'https://picsum.photos/154/154', points: 1500, isOnline: false, isFollowing: false },
  { id: 'f5', name: 'Roberto Dias', avatar: 'https://picsum.photos/155/155', points: 1200, isOnline: true, isFollowing: true },
  { id: 'f6', name: 'Fernanda Mota', avatar: 'https://picsum.photos/156/156', points: 3400, isOnline: false, isFollowing: false },
];