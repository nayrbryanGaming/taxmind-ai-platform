import { useParams, useNavigate } from 'react-router-dom';
import { useReturnStore } from '@/stores/useReturnStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bot, AlertTriangle, TrendingUp } from 'lucide-react';
import TaxAgentRunner from '@/components/agents/TaxAgentRunner';

export default function ReturnAnalysis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ret = useReturnStore(s => s.returns[id ?? '']);

  return (
    <div className="max-w-[1000px] mx-auto space-y-5">
      <Button variant="ghost" size="sm" className="text-xs text-tm-text-secondary px-0" onClick={() => navigate(`/returns/${id}`)}>
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Return
      </Button>
      <div className="flex items-center gap-3">
        <Bot className="w-6 h-6 text-tm-brand" />
        <div>
          <h1 className="text-2xl font-semibold text-tm-text-primary">AI Return Analysis</h1>
          <p className="text-sm text-tm-text-secondary">{ret?.clientName} · Form {ret?.form}</p>
        </div>
      </div>

      {ret?.aiFlags && ret.aiFlags.length > 0 && (
        <Card className="bg-tm-bg-card border-tm-tax-opportunity/30">
          <CardContent className="p-4 space-y-3">
            <h3 className="section-title flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-tm-tax-opportunity" /> AI-Identified Flags</h3>
            {ret.aiFlags.map((flag, i) => (
              <div key={i} className="flex items-start gap-2 bg-tm-bg-elevated rounded-md p-3 border border-tm-border/50">
                <TrendingUp className="w-4 h-4 text-tm-tax-opportunity shrink-0 mt-0.5" />
                <span className="text-xs text-tm-text-secondary leading-relaxed">{flag}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <TaxAgentRunner
        agentId="agent-return-analyzer"
        contextData={{ returnId: ret?.id, form: ret?.form, grossIncome: ret?.grossIncome, taxableIncome: ret?.taxableIncome, status: ret?.status, clientName: ret?.clientName }}
        buttonLabel="Run Business Return Analyzer"
      />
    </div>
  );
}
