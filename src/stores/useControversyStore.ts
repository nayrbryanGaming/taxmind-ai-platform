import { create } from 'zustand';

export interface IRSNotice {
  id: string;
  noticeNumber: string;
  clientId: string;
  clientName: string;
  noticeType: 'CP2000' | 'CP3219' | 'CP501' | 'CP503' | 'CP504' | 'CP90' | '30_DAY_LETTER' | '90_DAY_LETTER' | 'AUDIT' | 'OTHER';
  taxYear: number;
  amountInDispute: number;
  status: 'OPEN' | 'RESPONDED' | 'APPEALED' | 'CLOSED' | 'LITIGATION';
  dateReceived: string;
  responseDueDate: string;
  dateResponded?: string;
  irsPosition: string;
  taxpayerPosition: string;
  responseLetter?: string;
  penaltiesAssessed?: number;
  interestAccrued?: number;
  assignedCPA: string;
  notes: string;
  createdAt: number;
  updatedAt: number;
}

interface ControversyStore {
  notices: Record<string, IRSNotice>;
  addNotice: (n: Omit<IRSNotice, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateNotice: (id: string, patch: Partial<IRSNotice>) => void;
  getByClient: (clientId: string) => IRSNotice[];
  getOpenNotices: () => IRSNotice[];
  getOverdueResponses: () => IRSNotice[];
}

export const useControversyStore = create<ControversyStore>((set, get) => ({
  notices: {},

  addNotice: (n) => {
    const id = `notice_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
    set(state => ({
      notices: { ...state.notices, [id]: { ...n, id, createdAt: Date.now(), updatedAt: Date.now() } },
    }));
    return id;
  },

  updateNotice: (id, patch) => set(state => {
    if (!state.notices[id]) return state;
    return { notices: { ...state.notices, [id]: { ...state.notices[id], ...patch, updatedAt: Date.now() } } };
  }),

  getByClient: (cid) => Object.values(get().notices).filter(n => n.clientId === cid),
  getOpenNotices: () => Object.values(get().notices).filter(n => n.status === 'OPEN' || n.status === 'RESPONDED'),
  getOverdueResponses: () => {
    const today = new Date().toISOString().split('T')[0];
    return Object.values(get().notices).filter(n => n.status === 'OPEN' && n.responseDueDate < today);
  },
}));
