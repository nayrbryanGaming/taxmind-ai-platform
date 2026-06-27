import { useState } from 'react';
import { calculateMACRS, calculate179Limit, fmtTax } from '@/lib/tax/calculations';
import type { DepreciableAsset, AssetDepreciationSchedule, MACRSRecoveryPeriod } from '@/lib/tax/calculations';
import { SEC179_LIMITS_2024 } from '@/lib/tax/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingDown, Plus, Trash2, Calculator } from 'lucide-react';

export default function DepreciationCalc() {
  const [assets, setAssets] = useState<DepreciableAsset[]>([]);
  const [schedules, setSchedules] = useState<Record<string, AssetDepreciationSchedule>>({});
  const [form, setForm] = useState({
    description: '', dateInService: '2024-01-01', originalCost: 100000,
    recoveryPeriod: '5' as MACRSRecoveryPeriod, businessUsePct: 100,
    sec179Election: 0, bonusDepreciationPct: 60, listedProperty: false,
  });

  const addAsset = () => {
    if (!form.description || form.originalCost <= 0) return;
    const asset: DepreciableAsset = {
      id: `asset_${Date.now()}`,
      description: form.description,
      dateInService: form.dateInService,
      originalCost: form.originalCost,
      recoveryPeriod: form.recoveryPeriod,
      convention: 'HY',
      method: 'GDS_200DB',
      businessUsePct: form.businessUsePct,
      sec179Election: form.sec179Election,
      bonusDepreciationPct: form.bonusDepreciationPct,
      listedProperty: form.listedProperty,
    };
    setAssets([...assets, asset]);
    const schedule = calculateMACRS(asset);
    setSchedules({ ...schedules, [asset.id]: schedule });
    setForm({ ...form, description: '', originalCost: 100000, sec179Election: 0 });
  };

  const removeAsset = (id: string) => {
    setAssets(assets.filter(a => a.id !== id));
    const newSchedules = { ...schedules };
    delete newSchedules[id];
    setSchedules(newSchedules);
  };

  const totalCost = assets.reduce((s, a) => s + a.originalCost, 0);
  const total179 = assets.reduce((s, a) => s + (schedules[a.id]?.sec179Taken ?? 0), 0);
  const totalBonus = assets.reduce((s, a) => s + (schedules[a.id]?.bonusDepreciation ?? 0), 0);
  const totalYr1 = assets.reduce((s, a) => s + (schedules[a.id]?.firstYearTotal ?? 0), 0);
  const { allowed179, phaseOutAmount } = calculate179Limit(totalCost, total179);

  return (
    <div className="max-w-[1400px] mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <TrendingDown className="w-6 h-6 text-tm-brand" />
        <div>
          <h1 className="text-2xl font-semibold text-tm-text-primary">Depreciation & §179 Calculator</h1>
          <p className="text-sm text-tm-text-secondary">MACRS schedules, §179 elections, and bonus depreciation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Input Panel */}
        <Card className="bg-tm-bg-card border-tm-border">
          <CardContent className="p-5 space-y-4">
            <h3 className="section-title flex items-center gap-2"><Plus className="w-4 h-4" /> Add Asset</h3>
            <div>
              <Label className="form-label">Description</Label>
              <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-tax" placeholder="Server Equipment" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="form-label">Cost</Label>
                <Input type="number" value={form.originalCost} onChange={e => setForm({ ...form, originalCost: Number(e.target.value) })} className="input-tax font-data" />
              </div>
              <div>
                <Label className="form-label">Recovery Period</Label>
                <Select value={form.recoveryPeriod} onValueChange={v => setForm({ ...form, recoveryPeriod: v as MACRSRecoveryPeriod })}>
                  <SelectTrigger className="input-tax"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-tm-bg-elevated border-tm-border">
                    {['3', '5', '7', '10', '15', '20', '27.5', '39'].map(p => (
                      <SelectItem key={p} value={p}>{p}-Year</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="form-label">Date Placed in Service</Label>
              <Input type="date" value={form.dateInService} onChange={e => setForm({ ...form, dateInService: e.target.value })} className="input-tax" />
            </div>
            <div>
              <Label className="form-label">Business Use %: {form.businessUsePct}%</Label>
              <Slider value={[form.businessUsePct]} onValueChange={v => setForm({ ...form, businessUsePct: v[0] })} max={100} step={5} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="form-label">§179 Election</Label>
                <Input type="number" value={form.sec179Election} onChange={e => setForm({ ...form, sec179Election: Number(e.target.value) })} className="input-tax font-data" />
              </div>
              <div>
                <Label className="form-label">Bonus %</Label>
                <Input type="number" value={form.bonusDepreciationPct} onChange={e => setForm({ ...form, bonusDepreciationPct: Number(e.target.value) })} className="input-tax font-data" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.listedProperty} onChange={e => setForm({ ...form, listedProperty: e.target.checked })} className="accent-tm-brand" />
              <Label className="text-xs text-tm-text-secondary">Listed Property (§280F auto limits)</Label>
            </div>
            <Button className="w-full bg-tm-brand hover:bg-tm-brand-mid gap-1.5" onClick={addAsset}>
              <Plus className="w-4 h-4" /> Add to Schedule
            </Button>
          </CardContent>
        </Card>

        {/* Asset List */}
        <div className="lg:col-span-2 space-y-4">
          {/* §179 Summary */}
          <Card className="bg-tm-bg-card border-tm-border">
            <CardContent className="p-4">
              <h3 className="section-title mb-3">§179 Election Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><div className="text-[10px] text-tm-text-muted uppercase">Total Property</div><div className="font-data text-tm-text-number">{fmtTax.dollar(totalCost)}</div></div>
                <div><div className="text-[10px] text-tm-text-muted uppercase">§179 Elected</div><div className="font-data text-tm-text-number">{fmtTax.dollar(total179)}</div></div>
                <div><div className="text-[10px] text-tm-text-muted uppercase">Phase-Out</div><div className={`font-data ${phaseOutAmount > 0 ? 'text-tm-tax-liability' : 'text-tm-text-muted'}`}>{fmtTax.dollar(phaseOutAmount)}</div></div>
                <div><div className="text-[10px] text-tm-text-muted uppercase">Allowed §179</div><div className="font-data text-tm-tax-savings">{fmtTax.dollar(allowed179)}</div></div>
              </div>
              <div className="mt-3 text-[10px] text-tm-text-muted">Limit: {fmtTax.dollar(SEC179_LIMITS_2024.maxDeduction)} · Phase-out starts at {fmtTax.dollar(SEC179_LIMITS_2024.phaseOutStart)}</div>
            </CardContent>
          </Card>

          {/* Aggregate Summary */}
          <Card className="bg-tm-bg-card border-tm-border">
            <CardContent className="p-4">
              <h3 className="section-title mb-3">Aggregate First-Year Deductions</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-tm-bg-elevated rounded-lg">
                  <div className="text-[10px] text-tm-text-muted uppercase">§179</div>
                  <div className="font-data text-lg text-tm-brand-text">{fmtTax.dollar(total179)}</div>
                </div>
                <div className="text-center p-3 bg-tm-bg-elevated rounded-lg">
                  <div className="text-[10px] text-tm-text-muted uppercase">Bonus (60%)</div>
                  <div className="font-data text-lg text-tm-tax-savings">{fmtTax.dollar(totalBonus)}</div>
                </div>
                <div className="text-center p-3 bg-tm-brand-dim/40 rounded-lg border border-tm-brand/30">
                  <div className="text-[10px] text-tm-brand-text uppercase">Total Year 1</div>
                  <div className="font-data text-xl text-tm-text-number font-semibold">{fmtTax.dollar(totalYr1)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Asset List */}
          {assets.length > 0 && (
            <div className="space-y-4">
              {assets.map(asset => {
                const schedule = schedules[asset.id];
                return (
                  <Card key={asset.id} className="bg-tm-bg-card border-tm-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge className="text-[10px] bg-tm-bg-elevated text-tm-text-secondary">{asset.recoveryPeriod}-Year</Badge>
                          <span className="text-sm font-medium text-tm-text-primary">{asset.description}</span>
                          <span className="text-xs font-data text-tm-text-number">{fmtTax.dollar(asset.originalCost)}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-tm-tax-liability h-7 w-7 p-0" onClick={() => removeAsset(asset.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {schedule && (
                        <div>
                          <div className="flex items-center gap-4 mb-2 text-[10px]">
                            <span className="text-tm-text-muted">Basis: <span className="text-tm-text-number font-data">{fmtTax.dollar(schedule.depreciableBasis)}</span></span>
                            {schedule.sec179Taken > 0 && <span className="text-tm-brand-text">§179: <span className="font-data">{fmtTax.dollar(schedule.sec179Taken)}</span></span>}
                            {schedule.bonusDepreciation > 0 && <span className="text-tm-tax-savings">Bonus: <span className="font-data">{fmtTax.dollar(schedule.bonusDepreciation)}</span></span>}
                            <span className="text-tm-tax-savings font-medium">Year 1 Total: <span className="font-data">{fmtTax.dollar(schedule.firstYearTotal)}</span></span>
                          </div>
                          <Table>
                            <TableHeader>
                              <TableRow className="border-tm-border hover:bg-transparent">
                                <TableHead className="text-[10px] text-tm-text-muted h-7">Year</TableHead>
                                <TableHead className="text-[10px] text-tm-text-muted h-7">Rate</TableHead>
                                <TableHead className="text-[10px] text-tm-text-muted h-7 text-right">Deduction</TableHead>
                                <TableHead className="text-[10px] text-tm-text-muted h-7 text-right">Year-End Basis</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {schedule.schedule.map((row, i) => (
                                <TableRow key={i} className="border-tm-border/50 hover:bg-tm-bg-elevated/50">
                                  <TableCell className="text-xs font-data text-tm-text-primary py-1.5">{row.year}</TableCell>
                                  <TableCell className="text-xs font-data text-tm-text-secondary py-1.5">{fmtTax.pct(row.rate)}</TableCell>
                                  <TableCell className="text-xs font-data text-tm-tax-savings text-right py-1.5">{fmtTax.dollar(row.deduction)}</TableCell>
                                  <TableCell className="text-xs font-data text-tm-text-number text-right py-1.5">{fmtTax.dollar(row.yearEndBasis)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {assets.length === 0 && (
            <Card className="bg-tm-bg-card border-tm-border border-dashed">
              <CardContent className="p-8 text-center">
                <Calculator className="w-10 h-10 text-tm-text-muted mx-auto mb-3" />
                <p className="text-sm text-tm-text-muted">Add assets to generate depreciation schedules</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
