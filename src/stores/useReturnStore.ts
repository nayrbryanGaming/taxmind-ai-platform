import { create } from 'zustand';
import type { EntityType, ReturnStatus } from '@/lib/tax/constants';

export interface ReturnLineItem {
  lineRef: string;
  description: string;
  amount: number;
  source?: string;
  notes?: string;
}

export interface M1Adjustment {
  description: string;
  bookAmount: number;
  taxAmount: number;
  difference: number;
  adjustmentType: 'PERMANENT' | 'TEMPORARY';
}

export interface TaxReturn {
  id: string;
  returnNumber: string;
  clientId: string;
  clientName: string;
  entityType: EntityType;
  taxYear: number;
  status: ReturnStatus;
  form: string;
  grossIncome?: number;
  adjustedGrossIncome?: number;
  taxableIncome?: number;
  totalTaxLiability?: number;
  taxesPaid?: number;
  taxDueOrRefund?: number;
  qbiDeduction?: number;
  lineItems?: ReturnLineItem[];
  m1Adjustments?: M1Adjustment[];
  schedulesIncluded?: string[];
  originalDueDate: string;
  extensionDueDate?: string;
  extensionFiled: boolean;
  dateFiledOriginal?: string;
  dateFiledAmended?: string;
  preparedBy?: string;
  reviewedBy?: string;
  partnerApproval?: string;
  datePrepCompleted?: string;
  dateReviewCompleted?: string;
  datePartnerApproved?: string;
  budgetedHours?: number;
  actualHours?: number;
  billedAmount?: number;
  aiAnalysisDone: boolean;
  aiFlags?: string[];
  aiSummary?: string;
  prepNotes: string;
  reviewNotes: string;
  clientNotes: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

interface ReturnStore {
  returns: Record<string, TaxReturn>;
  counter: number;
  addReturn: (r: Omit<TaxReturn, 'id' | 'returnNumber' | 'createdAt' | 'updatedAt'>) => string;
  updateReturn: (id: string, patch: Partial<TaxReturn>) => void;
  advanceStatus: (id: string, newStatus: ReturnStatus, staffMember: string) => void;
  getByClient: (clientId: string) => TaxReturn[];
  getByStatus: (status: ReturnStatus) => TaxReturn[];
  getOverdue: () => TaxReturn[];
  getDueSoon: (days: number) => TaxReturn[];
  getTotalTaxDuePortfolio: () => number;
}

export const useReturnStore = create<ReturnStore>((set, get) => ({
  returns: {},
  counter: 1840,

  addReturn: (r) => {
    const counter = get().counter + 1;
    const returnNumber = `RET-${r.taxYear}-${String(counter).padStart(4, '0')}`;
    const id = `ret_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
    set(state => ({
      counter,
      returns: { ...state.returns, [id]: { ...r, id, returnNumber, tags: r.tags ?? [], aiAnalysisDone: false, extensionFiled: r.extensionFiled ?? false, prepNotes: r.prepNotes ?? '', reviewNotes: r.reviewNotes ?? '', clientNotes: r.clientNotes ?? '', createdAt: Date.now(), updatedAt: Date.now() } },
    }));
    return id;
  },

  updateReturn: (id, patch) => set(state => {
    if (!state.returns[id]) return state;
    return { returns: { ...state.returns, [id]: { ...state.returns[id], ...patch, updatedAt: Date.now() } } };
  }),

  advanceStatus: (id, newStatus, staffMember) => set(state => {
    if (!state.returns[id]) return state;
    const now = new Date().toISOString().split('T')[0];
    const ret = { ...state.returns[id], status: newStatus, updatedAt: Date.now() };
    if (newStatus === 'REVIEW') ret.datePrepCompleted = now;
    if (newStatus === 'FILED') { ret.partnerApproval = staffMember; ret.datePartnerApproved = now; }
    return { returns: { ...state.returns, [id]: ret } };
  }),

  getByClient: (cid) => Object.values(get().returns).filter(r => r.clientId === cid),
  getByStatus: (s) => Object.values(get().returns).filter(r => r.status === s),
  getOverdue: () => {
    const today = new Date().toISOString().split('T')[0];
    return Object.values(get().returns).filter(r => {
      if (['FILED', 'AMENDED'].includes(r.status)) return false;
      const due = r.extensionFiled ? r.extensionDueDate : r.originalDueDate;
      return due && due < today;
    });
  },
  getDueSoon: (days) => {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + days);
    const thr = threshold.toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return Object.values(get().returns).filter(r => {
      if (['FILED', 'AMENDED'].includes(r.status)) return false;
      const due = r.extensionFiled ? r.extensionDueDate : r.originalDueDate;
      return due && due >= today && due <= thr;
    });
  },
  getTotalTaxDuePortfolio: () => Object.values(get().returns).filter(r => r.status !== 'FILED' && (r.taxDueOrRefund ?? 0) > 0).reduce((s, r) => s + (r.taxDueOrRefund ?? 0), 0),
}));
