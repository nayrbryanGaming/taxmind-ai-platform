import { useState } from 'react';
import { calculateQBI, fmtTax } from '@/lib/tax/calculations';
import type { FilingStatus } from '@/lib/tax/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator } from 'lucide-react';

export default function QBICalc() {
  const [fs, setFs] = useState<FilingStatus>('MFJ');
  const [qbi, setQbi] = useState(200000);
  const [wages, setWages] = useState(80000);
  const [basis, setBasis] = useState(500000);
  const [taxableIncome, setTaxableIncome] = useState(350000);

  const result = calculateQBI({
    qbiFromEachActivity: [{ activity: 'Business', qbi, w2Wages: wages, unadjustedBasis: basis, isSSTB: false }],
    totalTaxableIncome: taxableIncome,
    filingStatus: fs,
    capitalGainsInTaxableIncome: 0,
  });

  return (
    <div className="max-w-[800px] mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Calculator className="w-6 h-6 text-tm-brand" />
        <h1 className="text-2xl font-semibold text-tm-text-primary">QBI (§199A) Calculator</h1>
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
                  <SelectItem value="MFJ">MFJ</SelectItem>
                  <SelectItem value="MFS">MFS</SelectItem>
                  <SelectItem value="HOH">HOH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label className="form-label">QBI Amount</Label><Input type="number" value={qbi} onChange={e => setQbi(Number(e.target.value))} className="input-tax font-data" /></div>
            <div><Label className="form-label">W-2 Wages</Label><Input type="number" value={wages} onChange={e => setWages(Number(e.target.value))} className="input-tax font-data" /></div>
            <div><Label className="form-label">Qualified Property Basis</Label><Input type="number" value={basis} onChange={e => setBasis(Number(e.target.value))} className="input-tax font-data" /></div>
            <div><Label className="form-label">Taxable Income</Label><Input type="number" value={taxableIncome} onChange={e => setTaxableIncome(Number(e.target.value))} className="input-tax font-data" /></div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-tm-bg-card border-tm-border">
        <CardContent className="p-5 space-y-3">
          <h3 className="section-title">QBI Deduction</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-tm-text-secondary">20% of QBI:</span><span className="font-data text-tm-text-number">{fmtTax.dollar(result.qbiBeforeLimitation)}</span></div>
            <div className="flex justify-between"><span className="text-tm-text-secondary">W-2 Wage Limit (50%):</span><span className="font-data text-tm-text-number">{fmtTax.dollar(result.w2WageLimit)}</span></div>
            <div className="flex justify-between"><span className="text-tm-text-secondary">W-2 + Property Limit:</span><span className="font-data text-tm-text-number">{fmtTax.dollar(result.w2PlusPropertyLimit)}</span></div>
            <div className="flex justify-between"><span className="text-tm-text-secondary">Phase-In %:</span><span className="font-data text-tm-tax-opportunity">{result.phaseInPct.toFixed(1)}%</span></div>
            <div className="border-t border-tm-border pt-2 flex justify-between"><span className="font-semibold text-tm-text-primary">Final QBI Deduction:</span><span className="font-data text-xl font-bold text-tm-tax-savings">{fmtTax.dollar(result.finalQBIDeduction)}</span></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
