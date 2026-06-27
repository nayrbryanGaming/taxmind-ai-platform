import { useState } from 'react';
import { calculateEstateTax, fmtTax } from '@/lib/tax/calculations';
import { ESTATE_GIFT_PARAMS_2024 } from '@/lib/tax/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Landmark, AlertTriangle } from 'lucide-react';
import TaxAgentRunner from '@/components/agents/TaxAgentRunner';

export default function EstateDashboard() {
  const [grossEstate, setGrossEstate] = useState(8200000);
  const [deductions, setDeductions] = useState(500000);

  const result = calculateEstateTax(grossEstate, deductions);

  return (
    <div className="max-w-[900px] mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Landmark className="w-6 h-6 text-tm-brand" />
        <div>
          <h1 className="text-2xl font-semibold text-tm-text-primary">Estate & Gift Tax Planning</h1>
          <p className="text-sm text-tm-text-secondary">2024 exemption: {fmtTax.dollar(ESTATE_GIFT_PARAMS_2024.lifetimeExemption)} per person</p>
        </div>
      </div>

      <Card className="bg-tm-tax-warning/5 border-tm-tax-warning/30">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-tm-tax-warning shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-tm-tax-warning">TCJA Sunset Warning</div>
            <p className="text-xs text-tm-text-secondary mt-1">Exemption drops to ~$7M (indexed) on 12/31/2025 unless Congress acts. URGENT planning window to use remaining exemption.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-tm-bg-card border-tm-border">
        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="form-label">Gross Estate Value</Label><Input type="number" value={grossEstate} onChange={e => setGrossEstate(Number(e.target.value))} className="input-tax font-data" /></div>
            <div><Label className="form-label">Allowable Deductions</Label><Input type="number" value={deductions} onChange={e => setDeductions(Number(e.target.value))} className="input-tax font-data" /></div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-tm-bg-card border-tm-border">
        <CardContent className="p-5 space-y-2">
          <h3 className="section-title">Estate Tax Calculation</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-tm-text-secondary">Gross Estate:</span><span className="font-data text-tm-text-number">{fmtTax.dollar(result.grossEstate)}</span></div>
            <div className="flex justify-between"><span className="text-tm-text-secondary">Deductions:</span><span className="font-data text-tm-tax-savings">-{fmtTax.dollar(result.allowableDeductions)}</span></div>
            <div className="flex justify-between"><span className="text-tm-text-secondary">Taxable Estate:</span><span className="font-data text-tm-text-number">{fmtTax.dollar(result.taxableEstate)}</span></div>
            <div className="border-t border-tm-border pt-2 flex justify-between"><span className="font-semibold text-tm-text-primary">Net Estate Tax:</span><span className="font-data text-lg font-bold text-tm-tax-liability">{fmtTax.dollar(result.netEstateTax)}</span></div>
            <div className="flex justify-between"><span className="text-tm-text-secondary">Remaining Exemption:</span><span className="font-data text-tm-tax-savings">{fmtTax.dollar(result.remainingExemption)}</span></div>
          </div>
        </CardContent>
      </Card>

      <TaxAgentRunner
        agentId="agent-estate-gift"
        contextData={{ grossEstate, deductions, netWorth: grossEstate }}
        buttonLabel="Generate Estate Planning Strategies"
      />
    </div>
  );
}
