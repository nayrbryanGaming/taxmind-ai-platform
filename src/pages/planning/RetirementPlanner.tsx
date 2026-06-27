import { useState } from 'react';
import { RETIREMENT_LIMITS_2024 } from '@/lib/tax/constants';
import { fmtTax } from '@/lib/tax/calculations';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { PiggyBank } from 'lucide-react';

export default function RetirementPlanner() {
  const [age, setAge] = useState(45);
  const [income, setIncome] = useState(200000);
  const catchUp = age >= 50;

  const limits = [
    { name: '401(k)', limit: RETIREMENT_LIMITS_2024.four01k + (catchUp ? RETIREMENT_LIMITS_2024.four01kCatchup : 0), icon: '💼' },
    { name: 'IRA / Roth IRA', limit: RETIREMENT_LIMITS_2024.ira + (catchUp ? RETIREMENT_LIMITS_2024.iraCatchup : 0), icon: '🏦' },
    { name: 'SEP-IRA', limit: Math.min(RETIREMENT_LIMITS_2024.sepIra, Math.floor(income * RETIREMENT_LIMITS_2024.sepPercent)), icon: '📈' },
    { name: 'HSA (Family)', limit: RETIREMENT_LIMITS_2024.hsaFamily + (age >= 55 ? RETIREMENT_LIMITS_2024.hsaCatchup : 0), icon: '🏥' },
  ];

  return (
    <div className="max-w-[900px] mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <PiggyBank className="w-6 h-6 text-tm-brand" />
        <h1 className="text-2xl font-semibold text-tm-text-primary">Retirement Contribution Planner</h1>
      </div>
      <Card className="bg-tm-bg-card border-tm-border">
        <CardContent className="p-5 space-y-4">
          <div>
            <Label className="form-label">Age: {age}</Label>
            <Slider value={[age]} onValueChange={v => setAge(v[0])} min={18} max={75} />
          </div>
          <div>
            <Label className="form-label">Annual Income</Label>
            <Input type="number" value={income} onChange={e => setIncome(Number(e.target.value))} className="input-tax font-data" />
          </div>
          {catchUp && <div className="text-xs text-tm-tax-savings bg-tm-tax-savings/10 rounded-md p-2">Catch-up contributions available (age 50+)</div>}
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-4">
        {limits.map(l => (
          <Card key={l.name} className="bg-tm-bg-card border-tm-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">{l.icon}</div>
              <div className="text-sm font-medium text-tm-text-primary">{l.name}</div>
              <div className="text-lg font-data text-tm-brand-text mt-1">{fmtTax.dollar(l.limit)}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
