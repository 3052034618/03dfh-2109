import { create } from 'zustand';
import type { CompanionCard, Companion, IntentionType } from '../types/companion';
import type { Trip, ChecklistItem } from '../types/trip';
import { mockCompanionCards } from '../data/companionCards';
import { mockTrips } from '../data/trips';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

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
}

export const useAppStore = create<AppState>((set) => ({
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
    })
}));
