import { useNavigate } from 'react-router-dom';
import { useClientStore } from '@/stores/useClientStore';
import { useReturnStore } from '@/stores/useReturnStore';
import { useResearchStore } from '@/stores/useResearchStore';
import { RETURN_STATUSES, TAX_DEADLINES_2025 } from '@/lib/tax/constants';
import { fmtTax } from '@/lib/tax/calculations';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users, FileText, AlertTriangle, TrendingUp, Clock,
  ArrowRight, Search, Zap, Lightbulb, ChevronRight, Calculator
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const clients = useClientStore(s => s.getActiveClients());
  const returns = useReturnStore(s => Object.values(s.returns));
  const overdue = useReturnStore(s => s.getOverdue());
  const inProgress = useReturnStore(s => s.getByStatus('IN_PROGRESS'));
  const underReview = useReturnStore(s => s.getByStatus('REVIEW'));
  const notStarted = useReturnStore(s => s.getByStatus('NOT_STARTED'));
  const totalTaxDue = useReturnStore(s => s.getTotalTaxDuePortfolio());
  const memos = useResearchStore(s => Object.values(s.memos).sort((a, b) => b.createdAt - a.createdAt).slice(0, 5));

  const today = new Date().toISOString().split('T')[0];
  const upcomingDeadlines = TAX_DEADLINES_2025
    .filter(d => d.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);

  // AI-flagged planning opportunities
  const planningOpportunities = returns
    .filter(r => r.aiFlags && r.aiFlags.length > 0)
    .flatMap(r => (r.aiFlags ?? []).map(flag => ({ clientName: r.clientName, flag, returnId: r.id, status: r.status })))
    .slice(0, 6);

  // Status breakdown
  const statusCounts = {
    NOT_STARTED: notStarted.length,
    IN_PROGRESS: inProgress.length,
    REVIEW: underReview.length,
    FILED: returns.filter(r => r.status === 'FILED').length,
  };
  const totalReturns = returns.length;

  const kpis = [
    { label: 'Active Clients', value: clients.length, icon: Users, color: 'text-tm-brand-text' },
    { label: 'Open Returns', value: inProgress.length, icon: FileText, color: 'text-tm-tax-opportunity' },
    { label: 'Due This Week', value: overdue.length, icon: AlertTriangle, color: overdue.length > 0 ? 'text-tm-tax-liability' : 'text-tm-tax-savings' },
    { label: 'Avg Realization', value: '94.2%', icon: TrendingUp, color: 'text-tm-tax-savings' },
    { label: 'Portfolio Tax Due', value: fmtTax.dollar(totalTaxDue), icon: Clock, color: 'text-tm-tax-liability' },
  ];

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpis.map(kpi => (
          <Card key={kpi.label} className="bg-tm-bg-card border-tm-border hover:border-tm-border-mid transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="kpi-label">{kpi.label}</span>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="kpi-value">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Return Status Board */}
          <Card className="bg-tm-bg-card border-tm-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title">Return Status Board</h3>
                <Button variant="ghost" size="sm" className="text-xs text-tm-brand-text hover:text-tm-brand h-7" onClick={() => navigate('/returns')}>
                  View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {Object.entries(statusCounts).map(([status, count]) => {
                  const config = RETURN_STATUSES[status as keyof typeof RETURN_STATUSES];
                  const pct = totalReturns > 0 ? (count / totalReturns) * 100 : 0;
                  return (
                    <div key={status} className="text-center">
                      <div className="text-2xl font-data font-semibold text-tm-text-number mb-1">{count}</div>
                      <div className="text-[10px] text-tm-text-secondary uppercase tracking-wider mb-2">{config.label}</div>
                      <div className="h-2 bg-tm-bg-elevated rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: config.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="bg-tm-bg-card border-tm-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title flex items-center gap-2">
                  <Clock className="w-4 h-4 text-tm-brand" /> Upcoming Deadlines
                </h3>
                <Button variant="ghost" size="sm" className="text-xs text-tm-brand-text hover:text-tm-brand h-7" onClick={() => navigate('/analytics/deadlines')}>
                  Full Calendar <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
              <div className="space-y-2">
                {upcomingDeadlines.map((d, i) => {
                  const daysOut = Math.ceil((new Date(d.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  const color = daysOut < 7 ? 'text-tm-tax-liability' : daysOut < 14 ? 'text-tm-tax-opportunity' : 'text-tm-tax-savings';
                  return (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-tm-border/50 last:border-0">
                      <div className={`text-xs font-data font-medium ${color} w-16 shrink-0`}>
                        {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <Badge className="text-[10px] bg-tm-bg-elevated text-tm-text-secondary border-tm-border shrink-0">{d.form}</Badge>
                      <span className="text-xs text-tm-text-primary flex-1 truncate">{d.description}</span>
                      <span className={`text-xs font-data ${color}`}>{daysOut}d</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Research Memos */}
          <Card className="bg-tm-bg-card border-tm-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title flex items-center gap-2">
                  <Search className="w-4 h-4 text-tm-brand" /> Recent Research Memos
                </h3>
                <Button variant="ghost" size="sm" className="text-xs text-tm-brand-text hover:text-tm-brand h-7" onClick={() => navigate('/research')}>
                  Library <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
              <div className="space-y-2">
                {memos.map(m => (
                  <div key={m.id} className="flex items-start gap-3 py-2 border-b border-tm-border/50 last:border-0 cursor-pointer hover:bg-tm-bg-elevated/50 rounded px-2 -mx-2 transition-colors" onClick={() => navigate(`/research/${m.id}`)}>
                    <div className="w-8 h-8 rounded bg-tm-ai-dim flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-4 h-4 text-tm-brand-text" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-tm-text-primary truncate">{m.questionSummary}</div>
                      <div className="text-[10px] text-tm-text-secondary mt-0.5">{m.clientName} · {m.primaryIRCSections.slice(0, 3).join(', ')}</div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge className={`text-[10px] ${m.confidenceLevel === 'HIGH' ? 'bg-tm-tax-savings/15 text-tm-tax-savings' : 'bg-tm-tax-opportunity/15 text-tm-tax-opportunity'}`}>
                        {m.confidenceLevel}
                      </Badge>
                      <ChevronRight className="w-3.5 h-3.5 text-tm-text-muted" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-5">
          {/* Planning Opportunities */}
          <Card className="bg-tm-bg-card border-tm-border">
            <CardContent className="p-4">
              <h3 className="section-title flex items-center gap-2 mb-4">
                <Lightbulb className="w-4 h-4 text-tm-tax-opportunity" /> Planning Opportunities
              </h3>
              <div className="space-y-3">
                {planningOpportunities.map((op, i) => (
                  <div key={i} className="bg-tm-bg-elevated rounded-md p-3 border border-tm-border/50">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-tm-text-primary">{op.clientName}</span>
                      <Badge className="text-[9px] bg-tm-tax-opportunity/15 text-tm-tax-opportunity">{op.status}</Badge>
                    </div>
                    <div className="text-[11px] text-tm-text-secondary leading-relaxed">{op.flag}</div>
                    <Button variant="ghost" size="sm" className="text-[10px] text-tm-brand-text hover:text-tm-brand h-6 mt-1 px-0" onClick={() => navigate(`/returns/${op.returnId}`)}>
                      View Return <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                ))}
                {planningOpportunities.length === 0 && (
                  <div className="text-xs text-tm-text-muted text-center py-4">No AI-flagged opportunities yet</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Client Complexity Heatmap */}
          <Card className="bg-tm-bg-card border-tm-border">
            <CardContent className="p-4">
              <h3 className="section-title mb-4">Client Complexity</h3>
              <div className="grid grid-cols-6 gap-1.5">
                {clients.slice(0, 54).map(c => {
                  const colors = ['#10B981', '#34D399', '#FBBF24', '#F59E0B', '#EF4444'];
                  return (
                    <button
                      key={c.id}
                      className="aspect-square rounded-sm transition-transform hover:scale-110"
                      style={{ backgroundColor: colors[c.complexityScore - 1] }}
                      title={`${c.legalName} — Complexity: ${c.complexityScore}/5`}
                      onClick={() => navigate(`/clients/${c.id}`)}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-3 text-[10px] text-tm-text-muted">
                <span>Simple (1)</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: ['#10B981', '#34D399', '#FBBF24', '#F59E0B', '#EF4444'][i - 1] }} />
                  ))}
                </div>
                <span>Complex (5)</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-tm-bg-card border-tm-border">
            <CardContent className="p-4">
              <h3 className="section-title mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: 'Entity Comparison', path: '/planning/entity-comparison', icon: Zap },
                  { label: 'Depreciation Calculator', path: '/planning/depreciation', icon: TrendingUp },
                  { label: 'New Research Memo', path: '/research/new', icon: Search },
                  { label: 'QBI Optimizer', path: '/planning/qbi', icon: Calculator },
                ].map(action => (
                  <Button key={action.path} variant="outline" className="w-full justify-start text-xs border-tm-border bg-tm-bg-elevated text-tm-text-primary hover:bg-tm-bg-overlay hover:border-tm-border-bright h-9" onClick={() => navigate(action.path)}>
                    <action.icon className="w-3.5 h-3.5 mr-2 text-tm-brand" /> {action.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
