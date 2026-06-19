import { create } from 'zustand';
import type { UserProfile, UserPreferences, ScriptType } from '../types/user';

interface UserState {
  profile: UserProfile;
  setProfile: (profile: Partial<UserProfile>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: {
    id: 'me',
    nickname: '剧本杀玩家',
    avatar: 'https://picsum.photos/id/64/200/200',
    residentCity: '北京',
    availableWeekends: ['2026-06-22', '2026-06-29', '2026-07-06'],
    scriptPreferences: ['campaign', 'emotion'],
    budget: {
      maxTransport: 800,
      maxAccommodation: 500
    },
    gender: 'male',
    age: 28,
    bio: '剧本杀爱好者，喜欢阵营本和情感本，周末有空就想打本'
  },
  setProfile: (profile) =>
    set((state) => ({
      profile: { ...state.profile, ...profile }
    })),
  updatePreferences: (preferences) =>
    set((state) => ({
      profile: {
        ...state.profile,
        ...preferences,
        budget: { ...state.profile.budget, ...preferences.budget }
      }
    }))
}));

export const useMatchScore = (gameCity: string, gameType: ScriptType, gameBudget: number) => {
  const { profile } = useUserStore();
  let score = 0;

  if (profile.scriptPreferences.includes(gameType)) {
    score += 40;
  }

  const totalBudget = profile.budget.maxTransport + profile.budget.maxAccommodation;
  if (gameBudget <= totalBudget) {
    score += 30;
  } else if (gameBudget <= totalBudget * 1.2) {
    score += 15;
  }

  score += Math.floor(Math.random() * 30) + 10;

  return Math.min(score, 100);
};
