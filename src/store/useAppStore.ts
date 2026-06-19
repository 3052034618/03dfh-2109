import { create } from 'zustand';
import type { CompanionCard, Companion, IntentionType } from '../types/companion';
import type { Trip, ChecklistItem } from '../types/trip';
import { mockCompanionCards } from '../data/companionCards';
import { mockTrips } from '../data/trips';

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
  companionCards: [...mockCompanionCards],
  trips: mockTrips.map(trip => ({
    ...trip,
    checklist: trip.checklist.map(item => ({ ...item }))
  })),

  addCompanionCard: (card) =>
    set((state) => ({
      companionCards: [card, ...state.companionCards]
    })),

  addIntention: (cardId, companion) =>
    set((state) => ({
      companionCards: state.companionCards.map((card) =>
        card.id === cardId
          ? { ...card, companions: [...card.companions, companion] }
          : card
      )
    })),

  confirmIntention: (cardId, companionId) =>
    set((state) => ({
      companionCards: state.companionCards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              companions: card.companions.map((c) =>
                c.id === companionId ? { ...c, isConfirmed: true } : c
              )
            }
          : card
      )
    })),

  toggleChecklistItem: (tripId, itemId) =>
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              checklist: trip.checklist.map((item) =>
                item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
              )
            }
          : trip
      )
    })),

  updateTripChecklist: (tripId, items) =>
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === tripId ? { ...trip, checklist: items } : trip
      )
    }))
}));
