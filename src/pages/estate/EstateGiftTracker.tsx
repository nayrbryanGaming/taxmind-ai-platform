import { Card, CardContent } from '@/components/ui/card';
import { Gift, Users } from 'lucide-react';
import { ESTATE_GIFT_PARAMS_2024 } from '@/lib/tax/constants';
import { fmtTax } from '@/lib/tax/calculations';

export default function EstateGiftTracker() {
  return (
    <div className="max-w-[800px] mx-auto space-y-5">
      <h1 className="text-2xl font-semibold text-tm-text-primary flex items-center gap-2"><Gift className="w-6 h-6 text-tm-brand" /> Annual Gift Tracker</h1>
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-tm-bg-card border-tm-border">
          <CardContent className="p-4 text-center">
            <div className="text-[10px] text-tm-text-muted uppercase">Annual Exclusion (2024)</div>
            <div className="text-2xl font-data text-tm-brand-text mt-1">{fmtTax.dollar(ESTATE_GIFT_PARAMS_2024.annualExclusion)}</div>
            <div className="text-xs text-tm-text-muted mt-1">per donee</div>
          </CardContent>
        </Card>
        <Card className="bg-tm-bg-card border-tm-border">
          <CardContent className="p-4 text-center">
            <div className="text-[10px] text-tm-text-muted uppercase">Married Gift-Splitting</div>
            <div className="text-2xl font-data text-tm-brand-text mt-1">{fmtTax.dollar(ESTATE_GIFT_PARAMS_2024.annualExclusion * 2)}</div>
            <div className="text-xs text-tm-text-muted mt-1">per donee couple</div>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-tm-bg-card border-tm-border">
        <CardContent className="p-5">
          <h3 className="section-title mb-3">Gift Tracking</h3>
          <div className="space-y-2">
            {['Child 1', 'Child 2', 'Grandchild 1', 'Grandchild 2'].map((name, i) => (
              <div key={name} className="flex items-center justify-between py-2 border-b border-tm-border/50">
                <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-tm-text-muted" /><span className="text-sm text-tm-text-primary">{name}</span></div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-tm-bg-elevated rounded-full overflow-hidden">
                    <div className="h-full bg-tm-brand rounded-full" style={{ width: `${[75, 100, 50, 0][i]}%` }} />
                  </div>
                  <span className="text-xs font-data text-tm-text-number">{fmtTax.dollar([13500, 18000, 9000, 0][i])}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
