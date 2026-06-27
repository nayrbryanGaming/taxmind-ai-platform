import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientStore } from '@/stores/useClientStore';
import { ENTITY_TYPES } from '@/lib/tax/constants';
import { fmtTax } from '@/lib/tax/calculations';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Plus, ArrowRight } from 'lucide-react';

const complexityColors: Record<number, string> = {
  1: 'bg-tm-tax-savings',
  2: 'bg-tm-tax-savings/70',
  3: 'bg-tm-tax-opportunity',
  4: 'bg-tm-tax-liability/70',
  5: 'bg-tm-tax-liability',
};

export default function ClientList() {
  const navigate = useNavigate();
  const clients = useClientStore(s => s.getActiveClients());
  const [query, setQuery] = useState('');
  const filtered = clients.filter(c =>
    !query || c.legalName.toLowerCase().includes(query.toLowerCase()) ||
    c.clientNumber.toLowerCase().includes(query.toLowerCase()) ||
    c.primaryContactName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-[1200px] mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-tm-text-primary tracking-tight">Clients</h1>
          <p className="text-sm text-tm-text-secondary mt-1">{clients.length} active clients</p>
        </div>
        <Button className="bg-tm-brand hover:bg-tm-brand-mid gap-1.5" onClick={() => navigate('/clients/new')}>
          <Plus className="w-4 h-4" /> New Client
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tm-text-muted" />
        <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, client number, or contact..." className="pl-10 bg-tm-bg-elevated border-tm-border" />
      </div>

      <div className="grid gap-3">
        {filtered.map(c => {
          const entity = ENTITY_TYPES[c.entityType];
          return (
            <Card key={c.id} className="bg-tm-bg-card border-tm-border hover:border-tm-border-mid transition-all cursor-pointer group" onClick={() => navigate(`/clients/${c.id}`)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-10 rounded-full ${complexityColors[c.complexityScore]}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-tm-text-primary">{c.legalName}</span>
                        <Badge className="text-[10px]" style={{ backgroundColor: entity.color + '20', color: entity.color, borderColor: entity.color + '30' }}>{entity.label}</Badge>
                        {c.priorityClient && <Badge className="text-[10px] bg-tm-tax-opportunity/15 text-tm-tax-opportunity">Priority</Badge>}
                        {c.highNetWorth && <Badge className="text-[10px] bg-tm-entity-ccorp/15 text-tm-entity-ccorp">HNW</Badge>}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-tm-text-secondary">
                        <span className="font-data text-tm-text-muted">{c.clientNumber}</span>
                        <span>{c.primaryContactName}</span>
                        <span>{c.city}, {c.state}</span>
                        <span>CPA: {c.responsibleCPA}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {c.lastYearGrossIncome && (
                      <div className="text-right hidden sm:block">
                        <div className="text-xs text-tm-text-muted">Gross Income</div>
                        <div className="text-sm font-data text-tm-text-number">{fmtTax.dollar(c.lastYearGrossIncome)}</div>
                      </div>
                    )}
                    {c.lastYearTaxPaid && (
                      <div className="text-right hidden sm:block">
                        <div className="text-xs text-tm-text-muted">Tax Paid</div>
                        <div className="text-sm font-data text-tm-tax-liability">{fmtTax.dollar(c.lastYearTaxPaid)}</div>
                      </div>
                    )}
                    <ArrowRight className="w-4 h-4 text-tm-text-muted group-hover:text-tm-brand transition-colors" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-tm-text-muted">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No clients found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
