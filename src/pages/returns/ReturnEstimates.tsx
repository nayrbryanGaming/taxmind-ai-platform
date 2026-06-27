import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { calculateEstimatedTaxes, fmtTax } from '@/lib/tax/calculations';
import type { FilingStatus } from '@/lib/tax/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CalendarDays } from 'lucide-react';

export default function ReturnEstimates() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fs, setFs] = useState<FilingStatus>('MFJ');
  const [priorTax, setPriorTax] = useState(500000);
  const [projectedTax, setProjectedTax] = useState(620000);
  const [withholding, setWithholding] = useState(580000);
  const [showResults, setShowResults] = useState(false);

  const schedule = calculateEstimatedTaxes(2025, fs, priorTax, projectedTax, withholding);

  return (
    <div className="max-w-[800px] mx-auto space-y-5">
      <Button variant="ghost" size="sm" className="text-xs text-tm-text-secondary px-0" onClick={() => navigate(`/returns/${id}`)}>
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Return
      </Button>
      <div className="flex items-center gap-3">
        <CalendarDays className="w-6 h-6 text-tm-brand" />
        <h1 className="text-2xl font-semibold text-tm-text-primary">Estimated Tax Schedule</h1>
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
            <div><Label className="form-label">Prior Year Tax</Label><Input type="number" value={priorTax} onChange={e => setPriorTax(Number(e.target.value))} className="input-tax font-data" /></div>
            <div><Label className="form-label">Projected Current Year Tax</Label><Input type="number" value={projectedTax} onChange={e => setProjectedTax(Number(e.target.value))} className="input-tax font-data" /></div>
            <div><Label className="form-label">Expected Withholding</Label><Input type="number" value={withholding} onChange={e => setWithholding(Number(e.target.value))} className="input-tax font-data" /></div>
          </div>
          <Button className="bg-tm-brand hover:bg-tm-brand-mid" onClick={() => setShowResults(true)}>Calculate Schedule</Button>
        </CardContent>
      </Card>

      {showResults && (
        <Card className="bg-tm-bg-card border-tm-border">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] text-tm-text-muted uppercase">Safe Harbor Method</div>
                <div className="text-sm font-medium text-tm-text-primary">{schedule.safeHarborMethod.replace(/_/g, ' ')}</div>
              </div>
              <div>
                <div className="text-[10px] text-tm-text-muted uppercase">Total Required</div>
                <div className="text-lg font-data text-tm-tax-liability">{fmtTax.dollar(schedule.totalRequired)}</div>
              </div>
              <div>
                <div className="text-[10px] text-tm-text-muted uppercase">Net of Withholding</div>
                <div className="text-lg font-data text-tm-text-number">{fmtTax.dollar(schedule.netRequiredPayments)}</div>
              </div>
            </div>

            <div className="space-y-2">
              {schedule.requiredPayments.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-tm-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-data font-medium text-tm-brand w-6">{p.quarter}</span>
                    <span className="text-xs text-tm-text-secondary">{p.dueDate}</span>
                  </div>
                  <span className="text-sm font-data text-tm-text-number">{fmtTax.dollar(p.amount)}</span>
                </div>
              ))}
            </div>

            {schedule.underpaymentRisk && (
              <div className="text-xs text-tm-tax-warning bg-tm-tax-warning/10 rounded-md p-2">⚠️ Underpayment risk: withholding is less than 75% of required safe harbor amount.</div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
