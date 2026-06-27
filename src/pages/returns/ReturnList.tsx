import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReturnStore } from '@/stores/useReturnStore';
import { RETURN_STATUSES, ENTITY_TYPES } from '@/lib/tax/constants';
import { fmtTax } from '@/lib/tax/calculations';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Search, Plus, ArrowRight, AlertTriangle } from 'lucide-react';

export default function ReturnList() {
  const navigate = useNavigate();
  const returns = Object.values(useReturnStore(s => s.returns));
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filtered = returns.filter(r => {
    const matchesQuery = !query || r.clientName.toLowerCase().includes(query.toLowerCase()) || r.form.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const overdue = returns.filter(r => {
    if (['FILED', 'AMENDED'].includes(r.status)) return false;
    const due = r.extensionFiled ? r.extensionDueDate : r.originalDueDate;
    return due && due < new Date().toISOString().split('T')[0];
  });

  return (
    <div className="max-w-[1200px] mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-tm-text-primary">Tax Returns</h1>
          <p className="text-sm text-tm-text-secondary mt-1">{returns.length} total returns · {overdue.length} overdue</p>
        </div>
        <Button className="bg-tm-brand hover:bg-tm-brand-mid gap-1.5" onClick={() => navigate('/returns/new')}>
          <Plus className="w-4 h-4" /> New Return
        </Button>
      </div>

      {/* Status Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {['ALL', ...Object.keys(RETURN_STATUSES)].map(s => (
          <Button key={s} size="sm" variant={statusFilter === s ? 'default' : 'outline'} className={`text-xs h-7 ${statusFilter === s ? 'bg-tm-brand' : 'border-tm-border bg-tm-bg-elevated text-tm-text-secondary'}`} onClick={() => setStatusFilter(s)}>
            {s === 'ALL' ? 'All' : RETURN_STATUSES[s as keyof typeof RETURN_STATUSES]?.label}
          </Button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tm-text-muted" />
        <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by client name, form..." className="pl-10 bg-tm-bg-elevated border-tm-border" />
      </div>

      <div className="space-y-2">
        {filtered.map(r => {
          const status = RETURN_STATUSES[r.status];
          const entity = ENTITY_TYPES[r.entityType];
          const daysUntilDue = r.originalDueDate ? Math.ceil((new Date(r.originalDueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
          return (
            <Card key={r.id} className="bg-tm-bg-card border-tm-border hover:border-tm-border-mid transition-all cursor-pointer group" onClick={() => navigate(`/returns/${r.id}`)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-tm-bg-elevated flex items-center justify-center">
                      <FileText className="w-4 h-4 text-tm-brand" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-tm-text-primary">{r.clientName}</span>
                        <Badge className="text-[10px]" style={{ backgroundColor: entity.color + '20', color: entity.color }}>{entity.form}</Badge>
                        <Badge className="text-[10px]" style={{ backgroundColor: status.color + '15', color: status.color }}>{status.label}</Badge>
                        {daysUntilDue < 0 && !['FILED', 'AMENDED'].includes(r.status) && (
                          <Badge className="text-[10px] bg-tm-tax-liability/15 text-tm-tax-liability gap-1"><AlertTriangle className="w-3 h-3" /> Overdue</Badge>
                        )}
                      </div>
                      <div className="text-xs text-tm-text-secondary mt-0.5">
                        {r.returnNumber} · Due: {r.originalDueDate} · Prepared by: {r.preparedBy || 'Unassigned'}
                        {r.actualHours !== undefined && r.budgetedHours !== undefined && ` · Hours: ${r.actualHours}/${r.budgetedHours}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {r.taxDueOrRefund !== undefined && r.taxDueOrRefund !== 0 && (
                      <span className={`text-sm font-data ${r.taxDueOrRefund > 0 ? 'text-tm-tax-liability' : 'text-tm-tax-savings'}`}>
                        {r.taxDueOrRefund > 0 ? 'Due: ' : 'Refund: '}{fmtTax.dollar(Math.abs(r.taxDueOrRefund))}
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-tm-text-muted group-hover:text-tm-brand transition-colors" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && <div className="text-center py-12 text-tm-text-muted"><FileText className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No returns found.</p></div>}
      </div>
    </div>
  );
}
