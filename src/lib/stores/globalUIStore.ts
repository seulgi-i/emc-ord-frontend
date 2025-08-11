import { create } from 'zustand';

interface GlobalUIState {
  isGlobalLoading: boolean;
  loadingMessage?: string;
  setGlobalLoading: (isLoading: boolean, message?: string) => void;
  clearLoading: () => void;
}

export const useGlobalUIStore = create<GlobalUIState>((set) => ({
  isGlobalLoading: false,
  loadingMessage: undefined,
  setGlobalLoading: (isLoading: boolean, message?: string) => 
    set({ isGlobalLoading: isLoading, loadingMessage: message }),
  clearLoading: () => 
    set({ isGlobalLoading: false, loadingMessage: undefined }),
}));
