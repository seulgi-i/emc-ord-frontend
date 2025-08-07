import { create } from 'zustand';

// 클라이언트 상태 (예: UI 상태)가 필요할 경우 여기에 추가합니다.
interface OrderClientState {
  // 예시: isSidebarOpen: boolean;
  // toggleSidebar: () => void;
}

export const useOrderStore = create<OrderClientState>((set) => ({
  // isSidebarOpen: false,
  // toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));