import { Card, CardContent } from '@/components/ui/card';
import { useClientStore } from '@/stores/useClientStore';
import { useReturnStore } from '@/stores/useReturnStore';
import { fmtTax } from '@/lib/tax/calculations';
import { BarChart3, Users, FileText, DollarSign, Clock } from 'lucide-react';

export default function FirmAnalytics() {
  const clients = useClientStore(s => s.getActiveClients());
  const returns = Object.values(useReturnStore(s => s.returns));
  const inProgress = useReturnStore(s => s.getByStatus('IN_PROGRESS'));

  const totalBilled = clients.reduce((s, c) => s + (c.ytdBilledAmount ?? 0), 0);
  const totalHours = clients.reduce((s, c) => s + (c.ytdBilledHours ?? 0), 0);

  return (
    <div className="max-w-[1200px] mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-tm-brand" />
        <h1 className="text-2xl font-semibold text-tm-text-primary">Firm Analytics</h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Clients', value: clients.length, icon: Users, format: (v: number) => String(v) },
          { label: 'Open Returns', value: inProgress.length, icon: FileText, format: (v: number) => String(v) },
          { label: 'YTD Billed', value: totalBilled, icon: DollarSign, format: fmtTax.dollar },
          { label: 'YTD Hours', value: totalHours, icon: Clock, format: (v: number) => String(v) },
        ].map(kpi => (
          <Card key={kpi.label} className="bg-tm-bg-card border-tm-border">
            <CardContent className="p-4">
              <kpi.icon className="w-4 h-4 text-tm-brand mb-2" />
              <div className="text-2xl font-data font-semibold text-tm-text-number">{kpi.format(kpi.value)}</div>
              <div className="text-[10px] text-tm-text-muted uppercase">{kpi.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-tm-bg-card border-tm-border">
          <CardContent className="p-4">
            <h3 className="section-title mb-3">Client Distribution</h3>
            <div className="space-y-2">
              {['S_CORP', 'C_CORP', 'PARTNERSHIP', 'INDIVIDUAL', 'TRUST_ESTATE'].map(et => {
                const count = clients.filter(c => c.entityType === et).length;
                const pct = clients.length > 0 ? (count / clients.length) * 100 : 0;
                return (
                  <div key={et} className="flex items-center gap-3">
                    <span className="text-xs text-tm-text-secondary w-24">{et.replace('_', ' ')}</span>
                    <div className="flex-1 h-2 bg-tm-bg-elevated rounded-full overflow-hidden">
                      <div className="h-full bg-tm-brand rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-data text-tm-text-number w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-tm-bg-card border-tm-border">
          <CardContent className="p-4">
            <h3 className="section-title mb-3">Return Status</h3>
            <div className="space-y-2">
              {['NOT_STARTED', 'IN_PROGRESS', 'REVIEW', 'FILED', 'OVERDUE'].map(st => {
                const count = returns.filter(r => r.status === st).length;
                const pct = returns.length > 0 ? (count / returns.length) * 100 : 0;
                return (
                  <div key={st} className="flex items-center gap-3">
                    <span className="text-xs text-tm-text-secondary w-24">{st.replace('_', ' ')}</span>
                    <div className="flex-1 h-2 bg-tm-bg-elevated rounded-full overflow-hidden">
                      <div className="h-full bg-tm-brand rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-data text-tm-text-number w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
