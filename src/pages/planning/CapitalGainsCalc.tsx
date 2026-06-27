import { useState } from 'react';
import { calculateCapGainsTax, fmtTax } from '@/lib/tax/calculations';
import type { FilingStatus } from '@/lib/tax/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp } from 'lucide-react';

export default function CapitalGainsCalc() {
  const [fs, setFs] = useState<FilingStatus>('MFJ');
  const [ordinaryIncome, setOrdinaryIncome] = useState(200000);
  const [ltcg, setLtcg] = useState(100000);
  const [stcg, setStcg] = useState(0);
  const [magi, setMagi] = useState(300000);

  const result = calculateCapGainsTax(ordinaryIncome, stcg, ltcg, 0, 0, fs, magi);

  return (
    <div className="max-w-[800px] mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-6 h-6 text-tm-brand" />
        <h1 className="text-2xl font-semibold text-tm-text-primary">Capital Gains Calculator</h1>
      </div>
      <Card className="bg-tm-bg-card border-tm-border">
        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="form-label">Filing Status</Label>
              <Select value={fs} onValueChange={v => setFs(v as FilingStatus)}>
                <SelectTrigger className="input-tax"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-tm-bg-elevated border-tm-border">
                  <SelectItem value="SINGLE">Single</SelectItem>
                  <SelectItem value="MFJ">Married Filing Jointly</SelectItem>
                  <SelectItem value="MFS">Married Filing Separately</SelectItem>
                  <SelectItem value="HOH">Head of Household</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label className="form-label">Ordinary Taxable Income</Label><Input type="number" value={ordinaryIncome} onChange={e => setOrdinaryIncome(Number(e.target.value))} className="input-tax font-data" /></div>
            <div><Label className="form-label">Long-Term Capital Gains</Label><Input type="number" value={ltcg} onChange={e => setLtcg(Number(e.target.value))} className="input-tax font-data" /></div>
            <div><Label className="form-label">Short-Term Capital Gains</Label><Input type="number" value={stcg} onChange={e => setStcg(Number(e.target.value))} className="input-tax font-data" /></div>
            <div><Label className="form-label">MAGI (for NIIT)</Label><Input type="number" value={magi} onChange={e => setMagi(Number(e.target.value))} className="input-tax font-data" /></div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-tm-bg-card border-tm-border">
        <CardContent className="p-5 space-y-3">
          <h3 className="section-title">Results</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-tm-text-muted">LTCG at 0%:</span> <span className="font-data text-tm-tax-savings">{fmtTax.dollar(result.at0pct)}</span></div>
            <div><span className="text-tm-text-muted">LTCG at 15%:</span> <span className="font-data text-tm-tax-opportunity">{fmtTax.dollar(result.at15pct)}</span></div>
            <div><span className="text-tm-text-muted">LTCG at 20%:</span> <span className="font-data text-tm-tax-liability">{fmtTax.dollar(result.at20pct)}</span></div>
            <div><span className="text-tm-text-muted">NIIT (3.8%):</span> <span className="font-data text-tm-tax-warning">{fmtTax.dollar(result.niitAmount)}</span></div>
          </div>
          <div className="border-t border-tm-border pt-3 flex justify-between">
            <span className="font-semibold text-tm-text-primary">Total Capital Gains Tax</span>
            <span className="font-data text-lg font-bold text-tm-tax-liability">{fmtTax.dollar(result.totalCapGainsTax)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
