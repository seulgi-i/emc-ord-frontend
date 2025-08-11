import { create } from 'zustand';

interface GlobalUIState {
  loadingCount: number;
  message?: string;
  showLoader: (message?: string) => void;
  hideLoader: () => void;
}

export const useGlobalUIStore = create<GlobalUIState>((set) => ({
  loadingCount: 0,
  message: undefined,
  showLoader: (message?: string) => {
    set(state => ({
      loadingCount: state.loadingCount + 1,
      // Set or update the message. Let the last message win.
      message: message || state.message || '로딩 중...',
    }));
  },
  hideLoader: () => {
    set(state => {
      const newCount = Math.max(0, state.loadingCount - 1);
      return {
        loadingCount: newCount,
        // Clear the message only when the last loader is gone.
        message: newCount === 0 ? undefined : state.message,
      };
    });
  },
}));