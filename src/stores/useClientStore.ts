import { create } from 'zustand';
import type { EntityType } from '@/lib/tax/constants';

export interface TaxClient {
  id: string;
  clientNumber: string;
  clientType: 'INDIVIDUAL' | 'BUSINESS' | 'TRUST' | 'NONPROFIT';
  entityType: EntityType;
  status: 'ACTIVE' | 'INACTIVE' | 'PROSPECT' | 'TERMINATED';
  legalName: string;
  dbaName?: string;
  ein?: string;
  ssn?: string;
  taxYear: number;
  fiscalYearEnd?: string;
  naicsCode?: string;
  stateOfIncorporation?: string;
  dateIncorporated?: string;
  statesFilingIn?: string[];
  primaryContactName: string;
  primaryEmail: string;
  primaryPhone: string;
  mailingAddress: string;
  city: string;
  state: string;
  zip: string;
  responsibleCPA: string;
  assignedStaff: string[];
  referralSource?: string;
  lastYearGrossIncome?: number;
  lastYearTaxPaid?: number;
  lastYearRefund?: number;
  priorFirmName?: string;
  electionsOnFile: string[];
  extensionFiled: boolean;
  extensionDate?: string;
  hourlyRate?: number;
  flatFeeAgreement?: boolean;
  flatFeeAmount?: number;
  ytdBilledHours?: number;
  ytdBilledAmount?: number;
  highNetWorth: boolean;
  internationalExposure: boolean;
  irsAuditHistory: boolean;
  priorityClient: boolean;
  complexityScore: 1 | 2 | 3 | 4 | 5;
  notes: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

interface ClientStore {
  clients: Record<string, TaxClient>;
  counter: number;
  addClient: (c: Omit<TaxClient, 'id' | 'clientNumber' | 'createdAt' | 'updatedAt'>) => string;
  updateClient: (id: string, patch: Partial<TaxClient>) => void;
  deactivateClient: (id: string) => void;
  getActiveClients: () => TaxClient[];
  getByEntityType: (type: EntityType) => TaxClient[];
  getHighNetWorthClients: () => TaxClient[];
  getInternationalClients: () => TaxClient[];
  searchClients: (query: string) => TaxClient[];
}

export const useClientStore = create<ClientStore>((set, get) => ({
  clients: {},
  counter: 480,

  addClient: (c) => {
    const counter = get().counter + 1;
    const clientNumber = `APX-${new Date().getFullYear()}-${String(counter).padStart(4, '0')}`;
    const id = `client_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
    set(state => ({
      counter,
      clients: { ...state.clients, [id]: { ...c, id, clientNumber, tags: c.tags ?? [], electionsOnFile: c.electionsOnFile ?? [], assignedStaff: c.assignedStaff ?? [], createdAt: Date.now(), updatedAt: Date.now() } },
    }));
    return id;
  },

  updateClient: (id, patch) => set(state => {
    if (!state.clients[id]) return state;
    return { clients: { ...state.clients, [id]: { ...state.clients[id], ...patch, updatedAt: Date.now() } } };
  }),

  deactivateClient: (id) => set(state => {
    if (!state.clients[id]) return state;
    return { clients: { ...state.clients, [id]: { ...state.clients[id], status: 'INACTIVE', updatedAt: Date.now() } } };
  }),

  getActiveClients: () => Object.values(get().clients).filter(c => c.status === 'ACTIVE'),
  getByEntityType: (t) => Object.values(get().clients).filter(c => c.entityType === t),
  getHighNetWorthClients: () => Object.values(get().clients).filter(c => c.highNetWorth),
  getInternationalClients: () => Object.values(get().clients).filter(c => c.internationalExposure),
  searchClients: (q) => {
    const query = q.toLowerCase();
    return Object.values(get().clients).filter(c =>
      c.legalName.toLowerCase().includes(query) ||
      c.clientNumber.toLowerCase().includes(query) ||
      c.primaryContactName.toLowerCase().includes(query) ||
      (c.ein?.includes(query) ?? false)
    );
  },
}));
