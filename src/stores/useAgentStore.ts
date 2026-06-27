import { create } from 'zustand';

export interface TaxAgent {
  id: string;
  name: string;
  description: string;
  icon: string;
  specialty: string;
  systemPrompt: string;
  outputFormat: 'json' | 'hybrid' | 'markdown';
  avgDurationSec: number;
  avgTokens: number;
  timesRun: number;
  enabled: boolean;
}

export interface AgentRun {
  id: string;
  agentId: string;
  agentName: string;
  status: 'running' | 'complete' | 'error';
  input: string;
  output?: string;
  durationMs?: number;
  timestamp: number;
}

interface AgentStore {
  agents: Record<string, TaxAgent>;
  runs: Record<string, AgentRun>;
  isRunning: boolean;
  currentRunId: string | null;
  toggleAgent: (id: string) => void;
  incrementRunCount: (id: string) => void;
  addRun: (run: Omit<AgentRun, 'id' | 'timestamp'>) => string;
  completeRun: (id: string, output: string, durationMs: number) => void;
  errorRun: (id: string, error: string) => void;
  getAgentRuns: (agentId: string) => AgentRun[];
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  agents: {},
  runs: {},
  isRunning: false,
  currentRunId: null,

  toggleAgent: (id) => set(state => {
    if (!state.agents[id]) return state;
    return { agents: { ...state.agents, [id]: { ...state.agents[id], enabled: !state.agents[id].enabled } } };
  }),

  incrementRunCount: (id) => set(state => {
    if (!state.agents[id]) return state;
    return { agents: { ...state.agents, [id]: { ...state.agents[id], timesRun: state.agents[id].timesRun + 1 } } };
  }),

  addRun: (run) => {
    const id = `run_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
    set(state => ({
      runs: { ...state.runs, [id]: { ...run, id, timestamp: Date.now() } },
      isRunning: true,
      currentRunId: id,
    }));
    return id;
  },

  completeRun: (id, output, durationMs) => set(state => {
    const runs = { ...state.runs };
    if (runs[id]) {
      runs[id] = { ...runs[id], status: 'complete', output, durationMs };
    }
    return { runs, isRunning: false, currentRunId: null };
  }),

  errorRun: (id, error) => set(state => {
    const runs = { ...state.runs };
    if (runs[id]) {
      runs[id] = { ...runs[id], status: 'error', output: error };
    }
    return { runs, isRunning: false, currentRunId: null };
  }),

  getAgentRuns: (agentId) => Object.values(get().runs).filter(r => r.agentId === agentId).sort((a, b) => b.timestamp - a.timestamp),
}));
