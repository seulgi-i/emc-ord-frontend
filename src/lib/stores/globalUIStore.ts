import { create } from 'zustand';

interface GlobalUIState {
  isGlobalLoading: boolean;
  setGlobalLoading: (isLoading: boolean) => void;
}

export const useGlobalUIStore = create<GlobalUIState>((set) => ({
  isGlobalLoading: false,
  setGlobalLoading: (isLoading: boolean) => set({ isGlobalLoading: isLoading }),
}));
