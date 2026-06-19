import type { ScriptType } from './user';

export interface GameStore {
  id: string;
  name: string;
  address: string;
  phone: string;
  city: string;
}

export interface TourGame {
  id: string;
  title: string;
  scriptName: string;
  scriptType: ScriptType;
  city: string;
  date: string;
  time: string;
  store: GameStore;
  price: number;
  deposit: number;
  totalPlayers: number;
  currentPlayers: number;
  matchScore: number;
  description: string;
  tags: string[];
  isLimited: boolean;
  coverImage: string;
}

export interface GameFilter {
  city: string;
  date: string;
  scriptType: ScriptType | 'all';
}
