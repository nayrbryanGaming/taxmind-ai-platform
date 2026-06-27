import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilePlus, Search, AlertTriangle } from 'lucide-react';
import { useReturnStore } from '@/stores/useReturnStore';

export default function Topbar() {
  const navigate = useNavigate();
  const overdue = Object.values(useReturnStore(s => s.returns)).filter(r => r.status !== 'FILED' && r.originalDueDate < new Date().toISOString().split('T')[0]);
  const inProgress = Object.values(useReturnStore(s => s.returns)).filter(r => r.status === 'IN_PROGRESS');

  const ticker = [
    'Q4 Est. Tax Due: Jan 15  |  W-2/1099 Due: Jan 31  |  Corps (1120): Mar 15',
    'Partnerships (1065): Mar 15  |  Individuals (1040): Apr 15',
    'Top §163(j) Rate: 5.31%  |  AFR Short-Term: 5.18%  |  §7520 Rate: 5.4%',
  ].join('    ');

  return (
    <header className="h-[52px] bg-tm-bg-surface border-b border-tm-border flex items-center px-4 shrink-0 z-30">
      {/* Left: Wordmark */}
      <div className="flex items-center gap-2 min-w-[200px]">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 group">
          <span className="font-display text-xl font-semibold text-tm-brand tracking-tight">TaxMind</span>
          <span className="text-[10px] font-ui font-bold bg-tm-brand text-white px-1 py-0.5 rounded leading-none">AI</span>
        </button>
      </div>

      {/* Center: Ticker */}
      <div className="flex-1 overflow-hidden mx-4 hidden md:block">
        <div className="text-xs font-data text-tm-text-secondary whitespace-nowrap animate-ticker">
          <span className="inline-block">{ticker}    {ticker}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5">
        <Button size="sm" className="bg-tm-brand hover:bg-tm-brand-mid text-white text-xs h-8 gap-1.5" onClick={() => navigate('/returns/new')}>
          <FilePlus className="w-3.5 h-3.5" /> New Return
        </Button>
        <Button size="sm" variant="outline" className="border-tm-border-mid bg-tm-bg-elevated text-tm-text-primary text-xs h-8 gap-1.5 hover:bg-tm-bg-overlay" onClick={() => navigate('/research/new')}>
          <Search className="w-3.5 h-3.5" /> New Research
        </Button>

        {inProgress.length > 0 && (
          <Badge className="bg-tm-tax-opportunity/15 text-tm-tax-opportunity border-tm-tax-opportunity/20 text-xs cursor-pointer hover:bg-tm-tax-opportunity/25" onClick={() => navigate('/returns')}>
            {inProgress.length} returns in progress
          </Badge>
        )}

        {overdue.length > 0 && (
          <Badge className="bg-tm-tax-liability/15 text-tm-tax-liability border-tm-tax-liability/20 text-xs cursor-pointer hover:bg-tm-tax-liability/25 gap-1" onClick={() => navigate('/returns')}>
            <AlertTriangle className="w-3 h-3" /> {overdue.length} overdue
          </Badge>
        )}

        <div className="hidden lg:block text-xs text-tm-text-secondary border-l border-tm-border pl-3 ml-1">
          Apex CPA Group
        </div>
      </div>
    </header>
  );
}
