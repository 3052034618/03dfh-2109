import { create } from 'zustand';
import type { CompanionCard, Companion, IntentionType } from '../types/companion';
import type { Trip, ChecklistItem, TripMessage, Expense, ExpenseCategory } from '../types/trip';
import { mockCompanionCards } from '../data/companionCards';
import { mockTrips } from '../data/trips';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';
import { scriptTypeLabels } from '../types/user';

const initialCompanionCards = loadFromStorage<CompanionCard[]>(STORAGE_KEYS.COMPANION_CARDS, mockCompanionCards);
const initialTrips = loadFromStorage<Trip[]>(STORAGE_KEYS.TRIPS, mockTrips);

interface AppState {
  companionCards: CompanionCard[];
  trips: Trip[];
  addCompanionCard: (card: CompanionCard) => void;
  addIntention: (cardId: string, companion: Companion) => void;
  confirmIntention: (cardId: string, companionId: string) => void;
  toggleChecklistItem: (tripId: string, itemId: string) => void;
  updateTripChecklist: (tripId: string, items: ChecklistItem[]) => void;
  setChecklistItemAssignee: (tripId: string, itemId: string, assigneeId?: string, assigneeName?: string) => void;
  createTripFromCard: (cardId: string) => Trip | null;
  setCardTripId: (cardId: string, tripId: string) => void;
  addTripMessage: (tripId: string, message: Omit<TripMessage, 'id' | 'tripId' | 'createdAt'>) => void;
  addExpense: (tripId: string, expense: Omit<Expense, 'id' | 'tripId' | 'createdAt'>) => void;
  toggleExpensePaid: (tripId: string, expenseId: string, memberId: string) => void;
}

const generateDefaultChecklist = (card: CompanionCard): ChecklistItem[] => {
  return [
    { id: `ci_${card.id}_1`, title: '订往返交通票', category: 'beforeDeparture', isCompleted: false, note: card.acceptShareCar ? '可考虑拼车' : '优先高铁/飞机', assigneeId: card.publisherId, assigneeName: card.publisherName },
    { id: `ci_${card.id}_2`, title: '预订酒店住宿', category: 'beforeDeparture', isCompleted: false, note: card.acceptShareRoom ? '建议双人房，可拼房' : '单人房', assigneeId: card.publisherId, assigneeName: card.publisherName },
    { id: `ci_${card.id}_3`, title: '支付定金给店家', category: 'beforeDeparture', isCompleted: false, note: `定金约¥${Math.round(card.budget * 0.2)}` },
    { id: `ci_${card.id}_4`, title: '确认店家开本时间', category: 'beforeArrival', isCompleted: false, note: '提前1天联系' },
    { id: `ci_${card.id}_5`, title: '整理出发行李/衣物', category: 'beforeArrival', isCompleted: false },
    { id: `ci_${card.id}_6`, title: '订好返程交通', category: 'beforeArrival', isCompleted: false, assigneeId: card.publisherId, assigneeName: card.publisherName },
    { id: `ci_${card.id}_7`, title: '店家地址导航收藏', category: 'beforeArrival', isCompleted: false, note: '提前看交通路线' },
    { id: `ci_${card.id}_8`, title: '拍照合影留念', category: 'afterReturn', isCompleted: false },
    { id: `ci_${card.id}_9`, title: '写剧评/反馈给店家', category: 'afterReturn', isCompleted: false }
  ];
};

const intentionLabels: Record<IntentionType, string> = {
  travel: '仅同行',
  table: '同桌',
  room: '同住',
  all: '全部'
};

export const useAppStore = create<AppState>((set, get) => ({
  companionCards: initialCompanionCards,
  trips: initialTrips,

  addCompanionCard: (card) =>
    set((state) => {
      const newCards = [card, ...state.companionCards];
      saveToStorage(STORAGE_KEYS.COMPANION_CARDS, newCards);
      return { companionCards: newCards };
    }),

  addIntention: (cardId, companion) =>
    set((state) => {
      const newCards = state.companionCards.map((card) =>
        card.id === cardId
          ? { ...card, companions: [...card.companions, companion] }
          : card
      );
      saveToStorage(STORAGE_KEYS.COMPANION_CARDS, newCards);
      return { companionCards: newCards };
    }),

  confirmIntention: (cardId, companionId) =>
    set((state) => {
      const newCards = state.companionCards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              companions: card.companions.map((c) =>
                c.id === companionId ? { ...c, isConfirmed: true } : c
              )
            }
          : card
      );
      saveToStorage(STORAGE_KEYS.COMPANION_CARDS, newCards);
      return { companionCards: newCards };
    }),

  toggleChecklistItem: (tripId, itemId) =>
    set((state) => {
      const newTrips = state.trips.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              checklist: trip.checklist.map((item) =>
                item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
              )
            }
          : trip
      );
      saveToStorage(STORAGE_KEYS.TRIPS, newTrips);
      return { trips: newTrips };
    }),

  updateTripChecklist: (tripId, items) =>
    set((state) => {
      const newTrips = state.trips.map((trip) =>
        trip.id === tripId ? { ...trip, checklist: items } : trip
      );
      saveToStorage(STORAGE_KEYS.TRIPS, newTrips);
      return { trips: newTrips };
    }),

  setChecklistItemAssignee: (tripId, itemId, assigneeId, assigneeName) =>
    set((state) => {
      const newTrips = state.trips.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              checklist: trip.checklist.map((item) =>
                item.id === itemId
                  ? { ...item, assigneeId, assigneeName }
                  : item
              )
            }
          : trip
      );
      saveToStorage(STORAGE_KEYS.TRIPS, newTrips);
      return { trips: newTrips };
    }),

  createTripFromCard: (cardId) => {
    const { companionCards, trips } = get();
    const card = companionCards.find(c => c.id === cardId);
    if (!card) return null;

    if (card.tripId) {
      const existingTrip = trips.find(t => t.id === card.tripId);
      return existingTrip || null;
    }

    const confirmedCompanions = card.companions.filter(c => c.isConfirmed);
    const tripCompanions = [
      {
        id: card.publisherId,
        nickname: card.publisherName,
        avatar: card.publisherAvatar,
        intention: 'all' as const,
        wechatId: card.publisherWechat,
        phone: card.publisherPhone
      },
      ...confirmedCompanions.map(c => ({
        id: c.userId,
        nickname: c.nickname,
        avatar: c.avatar,
        intention: c.intention,
        wechatId: c.wechatId,
        phone: c.phone
      }))
    ];

    const newTrip: Trip = {
      id: `trip_${card.id}_${Date.now()}`,
      title: `${card.targetCity}打《${card.scriptName}》`,
      city: card.targetCity,
      scriptName: card.scriptName,
      date: card.date,
      time: '14:00',
      storeName: card.targetCity + '剧本杀探店',
      storeAddress: card.targetCity + '市区核心商圈',
      storePhone: '暂未获取',
      depositPaid: 0,
      totalBudget: card.budget * (confirmedCompanions.length + 1),
      checklist: generateDefaultChecklist(card),
      status: 'upcoming',
      companions: tripCompanions,
      sourceCardId: card.id,
      acceptShareRoom: card.acceptShareRoom,
      acceptShareCar: card.acceptShareCar,
      messages: [],
      expenses: []
    };

    const newTrips = [newTrip, ...trips];
    const newCards = companionCards.map(c =>
      c.id === card.id ? { ...c, tripId: newTrip.id } : c
    );

    saveToStorage(STORAGE_KEYS.TRIPS, newTrips);
    saveToStorage(STORAGE_KEYS.COMPANION_CARDS, newCards);

    set({ trips: newTrips, companionCards: newCards });
    return newTrip;
  },

  setCardTripId: (cardId, tripId) =>
    set((state) => {
      const newCards = state.companionCards.map(c =>
        c.id === cardId ? { ...c, tripId } : c
      );
      saveToStorage(STORAGE_KEYS.COMPANION_CARDS, newCards);
      return { companionCards: newCards };
    }),

  addTripMessage: (tripId, message) =>
    set((state) => {
      const newMessage: TripMessage = {
        ...message,
        id: `msg_${tripId}_${Date.now()}`,
        tripId,
        createdAt: new Date().toISOString()
      };
      const newTrips = state.trips.map(trip =>
        trip.id === tripId
          ? { ...trip, messages: [...trip.messages, newMessage] }
          : trip
      );
      saveToStorage(STORAGE_KEYS.TRIPS, newTrips);
      return { trips: newTrips };
    }),

  addExpense: (tripId, expense) =>
    set((state) => {
      const newExpense: Expense = {
        ...expense,
        id: `exp_${tripId}_${Date.now()}`,
        tripId,
        createdAt: new Date().toISOString()
      };
      const newTrips = state.trips.map(trip =>
        trip.id === tripId
          ? { ...trip, expenses: [...trip.expenses, newExpense] }
          : trip
      );
      saveToStorage(STORAGE_KEYS.TRIPS, newTrips);
      return { trips: newTrips };
    }),

  toggleExpensePaid: (tripId, expenseId, memberId) =>
    set((state) => {
      const newTrips = state.trips.map(trip =>
        trip.id === tripId
          ? {
              ...trip,
              expenses: trip.expenses.map(exp =>
                exp.id === expenseId
                  ? {
                      ...exp,
                      paidMembers: exp.paidMembers.includes(memberId)
                        ? exp.paidMembers.filter(m => m !== memberId)
                        : [...exp.paidMembers, memberId]
                    }
                  : exp
              )
            }
          : trip
      );
      saveToStorage(STORAGE_KEYS.TRIPS, newTrips);
      return { trips: newTrips };
    })
}));
