export type IntentionType = 'travel' | 'table' | 'room' | 'all';

export interface IntentionOption {
  type: IntentionType;
  label: string;
  description: string;
}

export interface Companion {
  id: string;
  userId: string;
  nickname: string;
  avatar: string;
  intention: IntentionType;
  isConfirmed: boolean;
  city: string;
  wechatId?: string;
  phone?: string;
}

export interface CompanionCard {
  id: string;
  publisherId: string;
  publisherName: string;
  publisherAvatar: string;
  publisherWechat?: string;
  publisherPhone?: string;
  targetCity: string;
  scriptName: string;
  scriptType: string;
  date: string;
  missingRoles: number;
  totalRoles: number;
  acceptShareRoom: boolean;
  acceptShareCar: boolean;
  budget: number;
  description: string;
  companions: Companion[];
  createdAt: string;
  status: 'open' | 'full' | 'completed';
}

export interface IntentionRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  toUserId: string;
  cardId: string;
  intention: IntentionType;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
}
