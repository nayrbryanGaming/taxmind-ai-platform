import { Card, CardContent } from '@/components/ui/card';
import { Shield, TrendingDown } from 'lucide-react';
import { ESTATE_GIFT_PARAMS_2024 } from '@/lib/tax/constants';
import { fmtTax } from '@/lib/tax/calculations';

export default function EstateExemption() {
  return (
    <div className="max-w-[800px] mx-auto space-y-5">
      <h1 className="text-2xl font-semibold text-tm-text-primary flex items-center gap-2"><Shield className="w-6 h-6 text-tm-brand" /> Exemption Utilization</h1>
      <Card className="bg-tm-bg-card border-tm-border">
        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div><div className="text-[10px] text-tm-text-muted uppercase">Lifetime Exemption</div><div className="text-lg font-data text-tm-brand-text">{fmtTax.dollar(ESTATE_GIFT_PARAMS_2024.lifetimeExemption)}</div></div>
            <div><div className="text-[10px] text-tm-text-muted uppercase">Used</div><div className="text-lg font-data text-tm-tax-opportunity">{fmtTax.dollar(2100000)}</div></div>
            <div><div className="text-[10px] text-tm-text-muted uppercase">Remaining</div><div className="text-lg font-data text-tm-tax-savings">{fmtTax.dollar(ESTATE_GIFT_PARAMS_2024.lifetimeExemption - 2100000)}</div></div>
          </div>
          <div className="h-3 bg-tm-bg-elevated rounded-full overflow-hidden">
            <div className="h-full bg-tm-brand rounded-full" style={{ width: `${(2100000 / ESTATE_GIFT_PARAMS_2024.lifetimeExemption) * 100}%` }} />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-tm-tax-warning/5 border-tm-tax-warning/30">
        <CardContent className="p-4 flex items-center gap-3">
          <TrendingDown className="w-5 h-5 text-tm-tax-warning shrink-0" />
          <div className="text-xs text-tm-text-secondary">Post-2025 sunset: exemption drops to ~$7M indexed. Plan to use remaining exemption before 12/31/2025.</div>
        </CardContent>
      </Card>
    </div>
  );
}
