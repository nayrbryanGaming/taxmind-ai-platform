import { create } from 'zustand';

interface UIStore {
  sidebarCollapsed: boolean;
  activeClientId: string | null;
  activeTaxYear: number;
  theme: 'dark';
  toggleSidebar: () => void;
  setActiveClient: (id: string | null) => void;
  setActiveTaxYear: (year: number) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  activeClientId: null,
  activeTaxYear: 2024,
  theme: 'dark',

  toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setActiveClient: (id) => set({ activeClientId: id }),
  setActiveTaxYear: (year) => set({ activeTaxYear: year }),
}));
