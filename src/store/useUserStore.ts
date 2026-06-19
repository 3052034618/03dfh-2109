import { create } from 'zustand';
import type { UserProfile, UserPreferences, ScriptType } from '../types/user';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

const defaultProfile: UserProfile = {
  id: 'me',
  nickname: '剧本杀玩家',
  avatar: 'https://picsum.photos/id/64/200/200',
  residentCity: '北京',
  availableWeekends: ['2026-06-27', '2026-06-28', '2026-07-04', '2026-07-05'],
  scriptPreferences: ['campaign', 'emotion'],
  budget: {
    maxTransport: 800,
    maxAccommodation: 500
  },
  wechatId: 'jubensha_me',
  phone: '138****8888',
  gender: 'male',
  age: 28,
  bio: '剧本杀爱好者，喜欢阵营本和情感本，周末有空就想打本'
};

const initialProfile = loadFromStorage<UserProfile>(STORAGE_KEYS.USER_PROFILE, defaultProfile);

interface UserState {
  profile: UserProfile;
  setProfile: (profile: Partial<UserProfile>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: initialProfile,
  setProfile: (profile) =>
    set((state) => {
      const newProfile = { ...state.profile, ...profile };
      saveToStorage(STORAGE_KEYS.USER_PROFILE, newProfile);
      return { profile: newProfile };
    }),
  updatePreferences: (preferences) =>
    set((state) => {
      const newProfile = {
        ...state.profile,
        ...preferences,
        budget: { ...state.profile.budget, ...preferences.budget }
      };
      saveToStorage(STORAGE_KEYS.USER_PROFILE, newProfile);
      return { profile: newProfile };
    })
}));

export interface MatchReason {
  key: string;
  label: string;
  match: boolean;
  score: number;
}

export const calcMatchScore = (
  gameCity: string,
  gameType: ScriptType,
  gamePrice: number,
  gameDate: string,
  profile: UserProfile
): { score: number; reasons: MatchReason[] } => {
  const reasons: MatchReason[] = [];

  const typeMatch = profile.scriptPreferences.includes(gameType);
  if (typeMatch) {
    reasons.push({ key: 'type', label: '你喜欢的剧本类型', match: true, score: 40 });
  } else {
    reasons.push({ key: 'type', label: '不是你的偏好类型', match: false, score: 0 });
  }

  const totalBudget = profile.budget.maxTransport + profile.budget.maxAccommodation;
  if (gamePrice <= totalBudget) {
    reasons.push({ key: 'budget', label: '在你的预算内', match: true, score: 30 });
  } else if (gamePrice <= totalBudget * 1.2) {
    reasons.push({ key: 'budget', label: '略超预算但可接受', match: true, score: 15 });
  } else {
    reasons.push({ key: 'budget', label: '超出预算', match: false, score: 0 });
  }

  const weekendMatch = profile.availableWeekends.includes(gameDate);
  if (weekendMatch) {
    reasons.push({ key: 'weekend', label: '你有空的周末', match: true, score: 20 });
  } else {
    reasons.push({ key: 'weekend', label: '不在你空闲的周末', match: false, score: 0 });
  }

  if (gameCity === profile.residentCity) {
    reasons.push({ key: 'city', label: '你的常驻城市', match: true, score: 10 });
  } else {
    reasons.push({ key: 'city', label: '需要跨城出行', match: false, score: 5 });
  }

  const score = reasons.reduce((sum, r) => sum + r.score, 0);
  return { score: Math.min(score, 100), reasons };
};
