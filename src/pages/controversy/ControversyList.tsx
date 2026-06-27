import { useNavigate } from 'react-router-dom';
import { useControversyStore } from '@/stores/useControversyStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, Plus, ArrowRight } from 'lucide-react';
import { fmtTax } from '@/lib/tax/calculations';

export default function ControversyList() {
  const navigate = useNavigate();
  const notices = useControversyStore(s => s.getOpenNotices());

  return (
    <div className="max-w-[1000px] mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-tm-brand" />
          <div>
            <h1 className="text-2xl font-semibold text-tm-text-primary">IRS Controversy Tracker</h1>
            <p className="text-sm text-tm-text-secondary">{notices.length} open notices</p>
          </div>
        </div>
        <Button className="bg-tm-brand hover:bg-tm-brand-mid gap-1.5" onClick={() => navigate('/controversy/new')}>
          <Plus className="w-4 h-4" /> New Notice
        </Button>
      </div>

      <div className="space-y-2">
        {notices.map(n => (
          <Card key={n.id} className="bg-tm-bg-card border-tm-border hover:border-tm-tax-warning/30 transition-all cursor-pointer" onClick={() => navigate(`/controversy/${n.id}`)}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-4 h-4 text-tm-tax-warning" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-tm-text-primary">{n.noticeType}</span>
                      <Badge className="text-[10px] bg-tm-tax-warning/15 text-tm-tax-warning">{n.status}</Badge>
                    </div>
                    <div className="text-xs text-tm-text-secondary mt-0.5">{n.clientName} · TY {n.taxYear} · Due: {n.responseDueDate}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-data text-tm-tax-liability">{fmtTax.dollar(n.amountInDispute)}</span>
                  <ArrowRight className="w-4 h-4 text-tm-text-muted" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {notices.length === 0 && (
          <Card className="bg-tm-bg-card border-tm-border border-dashed">
            <CardContent className="p-8 text-center">
              <ShieldAlert className="w-12 h-12 text-tm-text-muted mx-auto mb-3" />
              <p className="text-sm text-tm-text-muted">No open notices. Add a new notice to begin tracking.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
