import { useState, useMemo } from 'react';
import { compareEntityStructures, fmtTax } from '@/lib/tax/calculations';
import type { FilingStatus } from '@/lib/tax/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Building2, Check, X, Crown } from 'lucide-react';
import TaxAgentRunner from '@/components/agents/TaxAgentRunner';

const entityColors: Record<string, { border: string; bg: string }> = {
  'Sole Proprietorship': { border: 'border-tm-entity-sole', bg: 'bg-tm-entity-sole/10' },
  'S-Corporation': { border: 'border-tm-entity-scorp', bg: 'bg-tm-entity-scorp/10' },
  'C-Corporation': { border: 'border-tm-entity-ccorp', bg: 'bg-tm-entity-ccorp/10' },
  'Partnership': { border: 'border-tm-entity-partner', bg: 'bg-tm-entity-partner/10' },
};

export default function EntityComparison() {
  const [income, setIncome] = useState(485000);
  const [salary, setSalary] = useState(180000);
  const [stateRate, setStateRate] = useState(0);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('MFJ');
  const [otherIncome, setOtherIncome] = useState(0);
  const [retained, setRetained] = useState(0);
  const [qbi, setQbi] = useState(true);
  const [showResults, setShowResults] = useState(false);

  const results = useMemo(() => {
    return compareEntityStructures({
      businessNetIncome: income,
      ownerW2Salary: salary,
      stateIncomeTaxRate: stateRate,
      ownerFilingStatus: filingStatus,
      ownerOtherIncome: otherIncome,
      retainedInCorp: retained,
      qualifiesForQBI: qbi,
    });
  }, [income, salary, stateRate, filingStatus, otherIncome, retained, qbi]);

  const sorted = Object.entries(results).sort((a, b) => a[1].totalTax - b[1].totalTax);
  const winner = sorted[0];

  return (
    <div className="max-w-[1200px] mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Building2 className="w-6 h-6 text-tm-brand" />
        <div>
          <h1 className="text-2xl font-semibold text-tm-text-primary">Entity Structure Optimizer</h1>
          <p className="text-sm text-tm-text-secondary">Compare tax burden across Sole Prop, S-Corp, C-Corp, and Partnership</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Input Panel */}
        <Card className="bg-tm-bg-card border-tm-border lg:col-span-1">
          <CardContent className="p-5 space-y-4">
            <h3 className="section-title">Business Parameters</h3>
            <div>
              <Label className="form-label">Business Net Income</Label>
              <Input type="number" value={income} onChange={e => setIncome(Number(e.target.value))} className="input-tax font-data" />
            </div>
            <div>
              <Label className="form-label">Owner W-2 Salary (S-Corp)</Label>
              <Input type="number" value={salary} onChange={e => setSalary(Number(e.target.value))} className="input-tax font-data" />
              <Slider value={[salary]} onValueChange={v => setSalary(v[0])} max={income} step={5000} className="mt-2" />
              <div className="text-[10px] text-tm-text-muted mt-1">{Math.round((salary / income) * 100)}% of income</div>
            </div>
            <div>
              <Label className="form-label">State Income Tax Rate</Label>
              <Input type="number" value={stateRate} onChange={e => setStateRate(Number(e.target.value))} className="input-tax font-data" step={0.01} />
            </div>
            <div>
              <Label className="form-label">Owner Filing Status</Label>
              <Select value={filingStatus} onValueChange={v => setFilingStatus(v as FilingStatus)}>
                <SelectTrigger className="input-tax"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-tm-bg-elevated border-tm-border">
                  <SelectItem value="SINGLE">Single</SelectItem>
                  <SelectItem value="MFJ">Married Filing Jointly</SelectItem>
                  <SelectItem value="MFS">Married Filing Separately</SelectItem>
                  <SelectItem value="HOH">Head of Household</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="form-label">Owner Other Income</Label>
              <Input type="number" value={otherIncome} onChange={e => setOtherIncome(Number(e.target.value))} className="input-tax font-data" />
            </div>
            <div>
              <Label className="form-label">Income Retained in C-Corp</Label>
              <Input type="number" value={retained} onChange={e => setRetained(Number(e.target.value))} className="input-tax font-data" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={qbi} onChange={e => setQbi(e.target.checked)} className="accent-tm-brand" />
              <Label className="text-xs text-tm-text-secondary">Qualifies for §199A QBI deduction</Label>
            </div>
            <Button className="w-full bg-tm-brand hover:bg-tm-brand-mid" onClick={() => setShowResults(true)}>
              Calculate All Structures
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-4">
          {showResults && winner && (
            <Card className="bg-tm-tax-savings/5 border-tm-tax-savings/30">
              <CardContent className="p-4 flex items-center gap-3">
                <Crown className="w-5 h-5 text-tm-tax-savings" />
                <div>
                  <div className="text-sm font-semibold text-tm-tax-savings">
                    {winner[1].entityType} is optimal — saves {fmtTax.dollar(Math.abs(winner[1].estimatedAnnualTaxSavingsVs?.['Sole_Proprietorship'] ?? 0))} vs Sole Proprietorship
                  </div>
                  <div className="text-xs text-tm-text-secondary mt-0.5">Effective total tax rate: {fmtTax.pct(winner[1].effectiveTotalRate)}</div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {showResults && sorted.map(([key, result]) => {
              const colors = entityColors[result.entityType] || { border: 'border-tm-border', bg: 'bg-tm-bg-elevated' };
              const isWinner = key === winner[0];
              return (
                <Card key={key} className={`bg-tm-bg-card ${colors.border} ${isWinner ? 'border-2' : 'border'} transition-all`}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-tm-text-primary">{result.entityType}</h3>
                      {isWinner && <Badge className="text-[10px] bg-tm-tax-savings/15 text-tm-tax-savings"><Crown className="w-3 h-3 mr-1" /> RECOMMENDED</Badge>}
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between"><span className="text-tm-text-secondary">Entity Tax:</span><span className="font-data text-tm-text-number">{fmtTax.dollar(result.totalBusinessTax)}</span></div>
                      <div className="flex justify-between"><span className="text-tm-text-secondary">Owner Tax:</span><span className="font-data text-tm-text-number">{fmtTax.dollar(result.ownerTax)}</span></div>
                      <div className="border-t border-tm-border pt-1.5 flex justify-between"><span className="font-medium text-tm-text-primary">Total Tax:</span><span className="font-data text-lg font-semibold text-tm-text-number">{fmtTax.dollar(result.totalTax)}</span></div>
                      <div className="flex justify-between"><span className="text-tm-text-secondary">Effective Rate:</span><span className="font-data text-tm-brand-text">{fmtTax.pct(result.effectiveTotalRate)}</span></div>
                      {result.qbiDeduction !== undefined && result.qbiDeduction > 0 && (
                        <div className="flex justify-between"><span className="text-tm-text-secondary">QBI Deduction:</span><span className="font-data text-tm-tax-savings">-{fmtTax.dollar(result.qbiDeduction)}</span></div>
                      )}
                      {result.selfEmploymentTax !== undefined && (
                        <div className="flex justify-between"><span className="text-tm-text-secondary">SE Tax:</span><span className="font-data text-tm-tax-liability">{fmtTax.dollar(result.selfEmploymentTax)}</span></div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] font-semibold text-tm-tax-savings uppercase">Advantages</div>
                      {result.advantages.slice(0, 2).map((a, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] text-tm-text-secondary"><Check className="w-3 h-3 text-tm-tax-savings shrink-0 mt-0.5" />{a}</div>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-semibold text-tm-tax-liability uppercase">Disadvantages</div>
                      {result.disadvantages.slice(0, 2).map((d, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] text-tm-text-secondary"><X className="w-3 h-3 text-tm-tax-liability shrink-0 mt-0.5" />{d}</div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {showResults && (
            <TaxAgentRunner
              agentId="agent-entity-optimizer"
              contextData={{ income, salary, stateRate, filingStatus, otherIncome, retained, qbi }}
              buttonLabel="Get AI Analysis"
            />
          )}
        </div>
      </div>
    </div>
  );
}
