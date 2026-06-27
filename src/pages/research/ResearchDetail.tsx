import { useParams, useNavigate } from 'react-router-dom';
import { useResearchStore } from '@/stores/useResearchStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User } from 'lucide-react';
import IRCChip from '@/components/ui-custom/IRCChip';
import TaxAgentRunner from '@/components/agents/TaxAgentRunner';

export default function ResearchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const memo = useResearchStore(s => s.memos[id ?? '']);

  if (!memo) return <div className="text-center py-20 text-tm-text-muted">Memo not found</div>;

  return (
    <div className="max-w-[1000px] mx-auto space-y-5">
      <Button variant="ghost" size="sm" className="text-xs text-tm-text-secondary px-0" onClick={() => navigate('/research')}>
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Library
      </Button>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-semibold text-tm-text-primary">{memo.questionSummary}</h1>
            <Badge className="text-[10px] bg-tm-bg-elevated text-tm-text-secondary">{memo.questionType}</Badge>
            <Badge className={`text-[10px] ${memo.status === 'FINAL' ? 'bg-tm-tax-savings/15 text-tm-tax-savings' : 'bg-tm-tax-opportunity/15 text-tm-tax-opportunity'}`}>{memo.status}</Badge>
          </div>
          <div className="text-xs font-data text-tm-text-secondary">{memo.memoNumber} · {memo.clientName}</div>
        </div>
      </div>

      {/* Metadata */}
      <Card className="bg-tm-bg-card border-tm-border">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-tm-text-muted text-xs">Prepared By</span><div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-tm-text-secondary" /><span className="text-tm-text-primary">{memo.preparedBy}</span></div></div>
            {memo.reviewedBy && <div><span className="text-tm-text-muted text-xs">Reviewed By</span><div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-tm-text-secondary" /><span className="text-tm-text-primary">{memo.reviewedBy}</span></div></div>}
            <div><span className="text-tm-text-muted text-xs">Confidence</span><div><Badge className={`text-[10px] ${memo.confidenceLevel === 'HIGH' ? 'bg-tm-tax-savings/15 text-tm-tax-savings' : 'bg-tm-tax-opportunity/15 text-tm-tax-opportunity'}`}>{memo.confidenceLevel}</Badge></div></div>
            <div><span className="text-tm-text-muted text-xs">Risk Level</span><div><Badge className={`text-[10px] ${memo.riskLevel === 'MINIMAL' ? 'bg-tm-tax-savings/15 text-tm-tax-savings' : memo.riskLevel === 'HIGH' ? 'bg-tm-tax-liability/15 text-tm-tax-liability' : 'bg-tm-tax-opportunity/15 text-tm-tax-opportunity'}`}>{memo.riskLevel}</Badge></div></div>
          </div>
          {memo.primaryIRCSections.length > 0 && (
            <div className="mt-3 pt-3 border-t border-tm-border">
              <span className="text-[10px] text-tm-text-muted uppercase mb-1.5 block">IRC Sections Cited</span>
              <div className="flex flex-wrap gap-1.5">
                {memo.primaryIRCSections.map((s, i) => <IRCChip key={i} section={s} />)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conclusion */}
      {memo.conclusion && (
        <Card className="bg-tm-ai-dim/30 border-tm-brand/20">
          <CardContent className="p-4">
            <h3 className="section-title text-tm-brand-text mb-2">Conclusion</h3>
            <p className="text-sm text-tm-text-secondary leading-relaxed font-memo">{memo.conclusion}</p>
          </CardContent>
        </Card>
      )}

      {/* Full Memo */}
      <Card className="bg-tm-bg-card border-tm-border">
        <CardContent className="p-5">
          <h3 className="section-title mb-4">Full Research Memo</h3>
          <div className="prose prose-invert prose-sm max-w-none font-memo leading-relaxed text-tm-text-secondary">
            {memo.memoContent.split('\n').map((line, i) => {
              if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-semibold text-tm-text-primary mt-6 mb-3">{line.slice(2)}</h1>;
              if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-semibold text-tm-text-primary mt-5 mb-2">{line.slice(3)}</h2>;
              if (line.startsWith('### ')) return <h3 key={i} className="text-base font-semibold text-tm-text-primary mt-4 mb-2">{line.slice(4)}</h3>;
              if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-tm-text-primary">{line.slice(2, -2)}</p>;
              if (line.startsWith('- ')) return <li key={i} className="ml-4 text-tm-text-secondary">{line.slice(2)}</li>;
              if (line.match(/^\d+\.\s/)) return <li key={i} className="ml-4 text-tm-text-secondary">{line.replace(/^\d+\.\s/, '')}</li>;
              if (line.trim() === '---') return <hr key={i} className="border-tm-border my-4" />;
              if (line.trim() === '') return <div key={i} className="h-2" />;
              return <p key={i} className="text-tm-text-secondary leading-relaxed">{line}</p>;
            })}
          </div>
        </CardContent>
      </Card>

      <TaxAgentRunner
        agentId="agent-tax-research"
        contextData={{ question: memo.questionDetail, type: memo.questionType, taxYear: memo.applicableTaxYear }}
        buttonLabel="Regenerate with AI"
      />
    </div>
  );
}
