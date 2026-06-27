import { useState } from 'react';
import { calculateIncomeTax, calculateCapGainsTax, calculateSETax, fmtTax } from '@/lib/tax/calculations';
import type { FilingStatus } from '@/lib/tax/constants';
import { STANDARD_DEDUCTION_2024 } from '@/lib/tax/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from 'lucide-react';

export default function IndividualPlanner() {
  const [fs, setFs] = useState<FilingStatus>('MFJ');
  const [wages, setWages] = useState(850000);
  const [seIncome, setSeIncome] = useState(0);
  const [ltcg, setLtcg] = useState(400000);
  const [stcg, setStcg] = useState(0);
  const [aboveLineDed, setAboveLineDed] = useState(80000);
  const [itemized, setItemized] = useState(45000);
  const [magi, setMagi] = useState(1820000);

  const stdDed = STANDARD_DEDUCTION_2024[fs];
  const useItemized = itemized > stdDed;
  const seResult = seIncome > 0 ? calculateSETax(seIncome, wages, fs, wages + seIncome) : null;
  const agi = wages + seIncome - (seResult?.deductiblePortionOfSE ?? 0) - aboveLineDed;
  const taxableIncome = Math.max(0, agi - (useItemized ? itemized : stdDed));
  const incomeTax = calculateIncomeTax(taxableIncome, fs);
  const capGains = calculateCapGainsTax(Math.max(0, taxableIncome - ltcg), stcg, ltcg, 0, 0, fs, magi);
  const totalTax = incomeTax.regularTax + capGains.totalCapGainsTax + (seResult?.totalSETax ?? 0);
  const effectiveRate = (wages + seIncome + ltcg) > 0 ? totalTax / (wages + seIncome + ltcg) : 0;

  return (
    <div className="max-w-[1200px] mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <User className="w-6 h-6 text-tm-brand" />
        <div>
          <h1 className="text-2xl font-semibold text-tm-text-primary">Individual Tax Planner</h1>
          <p className="text-sm text-tm-text-secondary">Federal income tax, capital gains, SE tax, AMT, and NIIT modeling</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Inputs */}
        <Card className="bg-tm-bg-card border-tm-border">
          <CardContent className="p-5 space-y-4">
            <h3 className="section-title">Income & Deductions</h3>
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
            <div><Label className="form-label">W-2 Wages</Label><Input type="number" value={wages} onChange={e => setWages(Number(e.target.value))} className="input-tax font-data" /></div>
            <div><Label className="form-label">Self-Employment Income</Label><Input type="number" value={seIncome} onChange={e => setSeIncome(Number(e.target.value))} className="input-tax font-data" /></div>
            <div><Label className="form-label">Long-Term Capital Gains</Label><Input type="number" value={ltcg} onChange={e => setLtcg(Number(e.target.value))} className="input-tax font-data" /></div>
            <div><Label className="form-label">Short-Term Capital Gains</Label><Input type="number" value={stcg} onChange={e => setStcg(Number(e.target.value))} className="input-tax font-data" /></div>
            <div><Label className="form-label">Above-the-Line Deductions</Label><Input type="number" value={aboveLineDed} onChange={e => setAboveLineDed(Number(e.target.value))} className="input-tax font-data" /></div>
            <div><Label className="form-label">Itemized Deductions</Label><Input type="number" value={itemized} onChange={e => setItemized(Number(e.target.value))} className="input-tax font-data" /></div>
            <div><Label className="form-label">MAGI (for NIIT)</Label><Input type="number" value={magi} onChange={e => setMagi(Number(e.target.value))} className="input-tax font-data" /></div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tax Waterfall */}
          <Card className="bg-tm-bg-card border-tm-border">
            <CardContent className="p-5 space-y-3">
              <h3 className="section-title">Tax Computation Waterfall</h3>
              {[
                { label: 'W-2 Wages', value: wages, color: 'bg-tm-brand' },
                seIncome > 0 ? { label: 'SE Income', value: seIncome, color: 'bg-tm-brand' } : null,
                { label: 'Above-the-Line Deductions', value: -aboveLineDed, color: 'bg-tm-tax-savings' },
                seResult ? { label: 'Deductible SE Tax (50%)', value: -(seResult.deductiblePortionOfSE), color: 'bg-tm-tax-savings' } : null,
                { label: `= AGI`, value: agi, color: 'bg-tm-brand-mid', isBold: true },
                { label: useItemized ? 'Itemized Deductions' : `Standard Deduction (${fmtTax.dollar(stdDed)})`, value: -(useItemized ? itemized : stdDed), color: 'bg-tm-tax-savings' },
                { label: '= Taxable Income (Ordinary)', value: Math.max(0, taxableIncome - ltcg), color: 'bg-tm-brand-mid', isBold: true },
                { label: 'Regular Tax (federal)', value: incomeTax.regularTax, color: 'bg-tm-tax-liability' },
                ltcg > 0 ? { label: 'Long-Term Capital Gains Tax', value: capGains.totalCapGainsTax, color: 'bg-tm-tax-liability' } : null,
                seResult ? { label: 'Self-Employment Tax', value: seResult.totalSETax, color: 'bg-tm-tax-liability' } : null,
                capGains.niitAmount > 0 ? { label: 'NIIT (3.8%)', value: capGains.niitAmount, color: 'bg-tm-tax-warning' } : null,
              ].filter(Boolean).map((step, i) => {
                const s = step as { label: string; value: number; color: string; isBold?: boolean };
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs ${s.isBold ? 'font-semibold text-tm-text-primary' : 'text-tm-text-secondary'}`}>{s.label}</span>
                      <span className={`text-xs font-data ${s.value < 0 ? 'text-tm-tax-savings' : s.color.includes('liability') || s.color.includes('warning') ? 'text-tm-tax-liability' : 'text-tm-text-number'} ${s.isBold ? 'font-semibold' : ''}`}>
                        {s.value < 0 ? '-' : ''}{fmtTax.dollar(Math.abs(s.value))}
                      </span>
                    </div>
                    {s.value !== 0 && (
                      <div className="h-1.5 bg-tm-bg-elevated rounded-full overflow-hidden">
                        <div className={`h-full ${s.color} rounded-full transition-all`} style={{ width: `${Math.min(100, Math.abs(s.value) / (Math.max(wages, ltcg, Math.abs(s.value))) * 100)}%` }} />
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="border-t border-tm-border pt-3 flex justify-between items-center">
                <span className="text-sm font-semibold text-tm-text-primary">Total Federal Tax</span>
                <span className="text-xl font-data font-bold text-tm-tax-liability">{fmtTax.dollar(totalTax)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-tm-text-secondary">Effective Rate</span>
                <span className="font-data text-tm-brand-text">{fmtTax.pct(effectiveRate)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-tm-text-secondary">Marginal Rate</span>
                <span className="font-data text-tm-tax-opportunity">{fmtTax.pct(incomeTax.marginalRate)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Bracket Breakdown */}
          <Card className="bg-tm-bg-card border-tm-border">
            <CardContent className="p-5">
              <h3 className="section-title mb-3">Bracket Breakdown</h3>
              <div className="space-y-2">
                {incomeTax.bracketBreakdown.map((b, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-data text-tm-text-secondary w-12">{fmtTax.pct(b.rate)}</span>
                    <div className="flex-1 h-3 bg-tm-bg-elevated rounded-full overflow-hidden">
                      <div className="h-full bg-tm-brand rounded-full transition-all" style={{ width: `${(b.incomeInBracket / incomeTax.taxableIncome) * 100}%` }} />
                    </div>
                    <span className="text-xs font-data text-tm-text-number w-24 text-right">{fmtTax.dollar(b.taxInBracket)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
