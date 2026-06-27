import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResearchStore } from '@/stores/useResearchStore';
import { RESEARCH_QUESTION_TYPES } from '@/lib/tax/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileText, Plus, ArrowRight } from 'lucide-react';

export default function ResearchLibrary() {
  const navigate = useNavigate();
  const memos = Object.values(useResearchStore(s => s.memos));
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filtered = memos.filter(m => {
    const matchesQuery = !query || m.questionSummary.toLowerCase().includes(query.toLowerCase()) || m.conclusion.toLowerCase().includes(query.toLowerCase());
    const matchesType = typeFilter === 'ALL' || m.questionType === typeFilter;
    return matchesQuery && matchesType;
  });

  return (
    <div className="max-w-[1200px] mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-tm-text-primary">Research Memo Library</h1>
          <p className="text-sm text-tm-text-secondary mt-1">{memos.length} memos on file</p>
        </div>
        <Button className="bg-tm-brand hover:bg-tm-brand-mid gap-1.5" onClick={() => navigate('/research/new')}>
          <Plus className="w-4 h-4" /> New Research
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tm-text-muted" />
          <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search memos..." className="pl-10 bg-tm-bg-elevated border-tm-border" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[200px] input-tax"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-tm-bg-elevated border-tm-border">
            <SelectItem value="ALL">All Types</SelectItem>
            {Object.entries(RESEARCH_QUESTION_TYPES).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {filtered.map(m => (
          <Card key={m.id} className="bg-tm-bg-card border-tm-border hover:border-tm-border-mid transition-all cursor-pointer group" onClick={() => navigate(`/research/${m.id}`)}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-tm-ai-dim flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-tm-brand-text" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-tm-text-primary">{m.questionSummary}</span>
                      <Badge className="text-[10px] bg-tm-bg-elevated text-tm-text-secondary">{m.questionType}</Badge>
                    </div>
                    <div className="text-xs text-tm-text-secondary mt-0.5">{m.clientName} · {m.memoNumber}</div>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      {m.primaryIRCSections.slice(0, 4).map((s, i) => (
                        <span key={i} className="irc-chip">{s}</span>
                      ))}
                      <Badge className={`text-[10px] ${m.confidenceLevel === 'HIGH' ? 'bg-tm-tax-savings/15 text-tm-tax-savings' : 'bg-tm-tax-opportunity/15 text-tm-tax-opportunity'}`}>
                        {m.confidenceLevel} confidence
                      </Badge>
                      <Badge className="text-[10px] bg-tm-bg-elevated text-tm-text-muted">{m.status}</Badge>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-tm-text-muted group-hover:text-tm-brand transition-colors shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-tm-text-muted"><Search className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No memos found.</p></div>}
      </div>
    </div>
  );
}
