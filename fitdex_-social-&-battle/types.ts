export enum TrainingGoal {
  HYPERTROPHY = 'Hipertrofia',
  WEIGHT_LOSS = 'Emagrecimento',
  ENDURANCE = 'Resistência',
  FLEXIBILITY = 'Flexibilidade',
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  category: 'Battle' | 'Gym' | 'Run' | 'Cycle';
  unlocked: boolean;
  progress: number; // 0 to 100
  maxProgress: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  coverPhoto?: string;
  bio: string;
  level: number;
  points: number;
  followers: number;
  following: number;
  goal: TrainingGoal;
  achievements: Achievement[];
  email?: string;
  location?: string;
  birthDate?: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  points: number;
  isOnline: boolean;
  isFollowing?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface ChatSession {
  friendId: string;
  messages: Message[];
}

export enum BattleRank {
  BRONZE = 'Bronze',
  SILVER = 'Prata',
  GOLD = 'Ouro',
  PLATINUM = 'Platina',
  DIAMOND = 'Diamante',
  MASTER = 'Mestre',
  TOP100 = 'Top 100'
}

export enum AppView {
  HOME = 'HOME',
  PROFILE = 'PROFILE',
  TRAINING = 'TRAINING',
  BATTLE = 'BATTLE',
  SOCIAL = 'SOCIAL',
  CHAT = 'CHAT',
  RECIPES = 'RECIPES',
  CALCULATOR = 'CALCULATOR',
  FRIENDS = 'FRIENDS',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
}