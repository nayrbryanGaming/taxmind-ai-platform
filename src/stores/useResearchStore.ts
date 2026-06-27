import { create } from 'zustand';

export interface TaxResearchMemo {
  id: string;
  memoNumber: string;
  clientId?: string;
  clientName?: string;
  taxYear?: number;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'FINAL' | 'SUPERSEDED';
  questionType: string;
  questionSummary: string;
  questionDetail: string;
  applicableTaxYear?: number;
  primaryIRCSections: string[];
  relatedRegulations: string[];
  revenueRulings: string[];
  plrs: string[];
  courtCases: string[];
  conclusion: string;
  confidenceLevel: 'HIGH' | 'MODERATE' | 'LOW' | 'UNCERTAIN';
  riskLevel: 'MINIMAL' | 'LOW' | 'MODERATE' | 'HIGH' | 'AGGRESSIVE';
  alternativePositions?: string;
  memoContent: string;
  preparedBy: string;
  reviewedBy?: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
}

interface ResearchStore {
  memos: Record<string, TaxResearchMemo>;
  counter: number;
  addMemo: (m: Omit<TaxResearchMemo, 'id' | 'memoNumber' | 'createdAt' | 'updatedAt'>) => string;
  updateMemo: (id: string, patch: Partial<TaxResearchMemo>) => void;
  searchMemos: (query: string) => TaxResearchMemo[];
  getByClient: (clientId: string) => TaxResearchMemo[];
}

export const useResearchStore = create<ResearchStore>((set, get) => ({
  memos: {},
  counter: 40,

  addMemo: (m) => {
    const counter = get().counter + 1;
    const memoNumber = `MEMO-2024-${String(counter).padStart(4, '0')}`;
    const id = `memo_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
    set(state => ({
      counter,
      memos: { ...state.memos, [id]: { ...m, id, memoNumber, tags: m.tags ?? [], createdAt: Date.now(), updatedAt: Date.now() } },
    }));
    return id;
  },

  updateMemo: (id, patch) => set(state => {
    if (!state.memos[id]) return state;
    return { memos: { ...state.memos, [id]: { ...state.memos[id], ...patch, updatedAt: Date.now() } } };
  }),

  searchMemos: (q) => {
    const query = q.toLowerCase();
    return Object.values(get().memos).filter(m =>
      m.questionSummary.toLowerCase().includes(query) ||
      m.conclusion.toLowerCase().includes(query) ||
      m.primaryIRCSections.some(s => s.toLowerCase().includes(query)) ||
      (m.clientName?.toLowerCase().includes(query) ?? false)
    );
  },

  getByClient: (cid) => Object.values(get().memos).filter(m => m.clientId === cid),
}));
