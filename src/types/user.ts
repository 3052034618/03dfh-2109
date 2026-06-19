export interface UserProfile {
  id: string;
  nickname: string;
  avatar: string;
  residentCity: string;
  availableWeekends: string[];
  scriptPreferences: ('campaign' | 'emotion' | 'suspense' | 'joy' | 'terror')[];
  budget: {
    maxTransport: number;
    maxAccommodation: number;
  };
  wechatId?: string;
  phone?: string;
  gender?: 'male' | 'female';
  age?: number;
  bio?: string;
}

export interface UserPreferences {
  residentCity: string;
  availableWeekends: string[];
  scriptPreferences: ('campaign' | 'emotion' | 'suspense' | 'joy' | 'terror')[];
  budget: {
    maxTransport: number;
    maxAccommodation: number;
  };
}

export type ScriptType = 'campaign' | 'emotion' | 'suspense' | 'joy' | 'terror';

export const scriptTypeLabels: Record<ScriptType, string> = {
  campaign: '阵营本',
  emotion: '情感本',
  suspense: '推理本',
  joy: '欢乐本',
  terror: '恐怖本'
};
