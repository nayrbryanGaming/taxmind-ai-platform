import { useNavigate, useLocation } from 'react-router-dom';
import { useUIStore } from '@/stores/useUIStore';
import { useClientStore } from '@/stores/useClientStore';
import { useReturnStore } from '@/stores/useReturnStore';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, FileText, Search, BookOpen,
  Building2, TrendingDown, User, PiggyBank, TrendingUp,
  Calculator, Home, CalendarDays, Map, Landmark, Globe,
  ShieldAlert, BarChart3, Settings, ChevronLeft, ChevronRight,
  Bot
} from 'lucide-react';

const navGroups = [
  {
    label: 'FIRM',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: Users, label: 'Clients', path: '/clients' },
      { icon: FileText, label: 'Tax Returns', path: '/returns' },
    ],
  },
  {
    label: 'RESEARCH',
    items: [
      { icon: Search, label: 'Research Memos', path: '/research' },
      { icon: BookOpen, label: 'IRC Code', path: '/research/irc' },
    ],
  },
  {
    label: 'PLANNING TOOLS',
    items: [
      { icon: Building2, label: 'Entity Optimizer', path: '/planning/entity-comparison' },
      { icon: TrendingDown, label: 'Depreciation', path: '/planning/depreciation' },
      { icon: User, label: 'Individual Planner', path: '/planning/individual' },
      { icon: PiggyBank, label: 'Retirement', path: '/planning/retirement' },
      { icon: TrendingUp, label: 'Capital Gains', path: '/planning/capital-gains' },
      { icon: Calculator, label: 'QBI (§199A)', path: '/planning/qbi' },
      { icon: Home, label: 'Home Office', path: '/planning/home-office' },
      { icon: CalendarDays, label: 'Year-End Planning', path: '/planning/year-end' },
    ],
  },
  {
    label: 'SPECIALTY',
    items: [
      { icon: Map, label: 'SALT', path: '/salt' },
      { icon: Landmark, label: 'Estate & Gift', path: '/estate' },
      { icon: Globe, label: 'International', path: '/international' },
      { icon: ShieldAlert, label: 'IRS Controversy', path: '/controversy' },
    ],
  },
  {
    label: 'ANALYTICS',
    items: [
      { icon: BarChart3, label: 'Firm Analytics', path: '/analytics' },
    ],
  },
  {
    label: 'AI',
    items: [
      { icon: Bot, label: 'AI Agents', path: '/agents' },
      { icon: Settings, label: 'Settings', path: '/settings' },
    ],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const activeClients = useClientStore(s => s.getActiveClients());
  const openReturns = useReturnStore(s => s.getByStatus('IN_PROGRESS'));

  return (
    <aside
      className={cn(
        'bg-tm-bg-surface border-r border-tm-border flex flex-col transition-all duration-300 shrink-0 z-20',
        sidebarCollapsed ? 'w-[52px]' : 'w-[240px]'
      )}
    >
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-16 w-6 h-6 bg-tm-bg-elevated border border-tm-border rounded-full flex items-center justify-center text-tm-text-secondary hover:text-tm-text-primary transition-colors z-30"
      >
        {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        {navGroups.map(group => (
          <div key={group.label} className="mb-1">
            {!sidebarCollapsed && (
              <div className="px-4 py-1.5 text-[10px] font-semibold text-tm-text-muted uppercase tracking-widest">
                {group.label}
              </div>
            )}
            {group.items.map(item => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-medium transition-all relative group',
                    isActive
                      ? 'text-tm-brand-text bg-tm-brand-dim/60'
                      : 'text-tm-text-secondary hover:text-tm-text-primary hover:bg-tm-bg-elevated',
                    sidebarCollapsed && 'justify-center px-2'
                  )}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-tm-brand rounded-r-full" />
                  )}
                  <item.icon className={cn('w-4 h-4 shrink-0', isActive && 'text-tm-brand')} />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom info */}
      {!sidebarCollapsed && (
        <div className="border-t border-tm-border p-3 text-[10px] font-data text-tm-text-muted leading-relaxed">
          <div>Tax Year: 2024</div>
          <div>Firm: {activeClients.length} active clients</div>
          <div>{openReturns.length} returns open</div>
        </div>
      )}
    </aside>
  );
}
