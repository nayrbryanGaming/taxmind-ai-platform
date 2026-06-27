import { Card, CardContent } from '@/components/ui/card';
import { FileWarning, AlertTriangle } from 'lucide-react';

export default function InternationalFBAR() {
  return (
    <div className="max-w-[800px] mx-auto space-y-5">
      <h1 className="text-2xl font-semibold text-tm-text-primary flex items-center gap-2"><FileWarning className="w-6 h-6 text-tm-brand" /> FBAR / FATCA Tracker</h1>
      <Card className="bg-tm-tax-warning/5 border-tm-tax-warning/30">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-tm-tax-warning shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-tm-tax-warning">FBAR Filing Requirements</div>
            <p className="text-xs text-tm-text-secondary mt-1">Aggregate foreign accounts &gt;$10,000 at any time requires FinCEN 114 filing. Due April 15 with auto-extension to October 15.</p>
            <p className="text-xs text-tm-tax-warning mt-1">Non-willful penalty: $10,000 per violation · Willful: greater of $100,000 or 50% of account balance</p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-tm-bg-card border-tm-border">
        <CardContent className="p-5">
          <h3 className="section-title mb-3">FATCA (Form 8938)</h3>
          <p className="text-xs text-tm-text-secondary">Specified foreign financial assets exceeding thresholds require Form 8938 filing with tax return.</p>
          <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
            <div className="bg-tm-bg-elevated rounded p-2"><span className="text-tm-text-muted">Single (year-end):</span><span className="font-data text-tm-text-primary ml-2">$50,000</span></div>
            <div className="bg-tm-bg-elevated rounded p-2"><span className="text-tm-text-muted">MFJ (year-end):</span><span className="font-data text-tm-text-primary ml-2">$100,000</span></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
