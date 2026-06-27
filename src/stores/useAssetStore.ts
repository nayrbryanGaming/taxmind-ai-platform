import { create } from 'zustand';
import type { DepreciableAsset, AssetDepreciationSchedule } from '@/lib/tax/calculations';
import { calculateMACRS } from '@/lib/tax/calculations';

interface AssetStore {
  assets: Record<string, DepreciableAsset>;
  schedules: Record<string, AssetDepreciationSchedule>;
  addAsset: (asset: Omit<DepreciableAsset, 'id'>) => string;
  removeAsset: (id: string) => void;
  computeSchedule: (id: string, taxYear?: number) => void;
  getClientAssets: (clientId: string) => DepreciableAsset[];
  clearAll: () => void;
}

export const useAssetStore = create<AssetStore>((set, get) => ({
  assets: {},
  schedules: {},

  addAsset: (asset) => {
    const id = `asset_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
    set(state => ({ assets: { ...state.assets, [id]: { ...asset, id } } }));
    get().computeSchedule(id);
    return id;
  },

  removeAsset: (id) => set(state => {
    const assets = { ...state.assets };
    const schedules = { ...state.schedules };
    delete assets[id];
    delete schedules[id];
    return { assets, schedules };
  }),

  computeSchedule: (id, taxYear) => {
    const asset = get().assets[id];
    if (!asset) return;
    const schedule = calculateMACRS(asset, taxYear);
    set(state => ({ schedules: { ...state.schedules, [id]: schedule } }));
  },

  getClientAssets: (_clientId) => Object.values(get().assets),
  clearAll: () => set({ assets: {}, schedules: {} }),
}));
