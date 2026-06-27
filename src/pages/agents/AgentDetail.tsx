import { useParams, useNavigate } from 'react-router-dom';
import { useAgentStore } from '@/stores/useAgentStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bot, Clock, FileText } from 'lucide-react';
import TaxAgentRunner from '@/components/agents/TaxAgentRunner';

export default function AgentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const agent = useAgentStore(s => s.agents[id ?? '']);
  const runs = useAgentStore(s => s.getAgentRuns(id ?? ''));

  if (!agent) return <div className="text-center py-20 text-tm-text-muted">Agent not found</div>;

  return (
    <div className="max-w-[900px] mx-auto space-y-5">
      <Button variant="ghost" size="sm" className="text-xs text-tm-text-secondary px-0" onClick={() => navigate('/agents')}>
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Agents
      </Button>

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-tm-ai-dim flex items-center justify-center">
          <Bot className="w-6 h-6 text-tm-brand-text" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-tm-text-primary">{agent.name}</h1>
          <p className="text-sm text-tm-text-secondary mt-1">{agent.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="text-[10px] bg-tm-ai-dim text-tm-brand-text">{agent.specialty}</Badge>
            <Badge className="text-[10px] bg-tm-bg-elevated text-tm-text-muted">Output: {agent.outputFormat}</Badge>
            <Badge className="text-[10px] bg-tm-bg-elevated text-tm-text-muted"><Clock className="w-3 h-3 mr-1" />~{agent.avgDurationSec}s</Badge>
          </div>
        </div>
      </div>

      <Card className="bg-tm-bg-card border-tm-border">
        <CardContent className="p-5">
          <h3 className="section-title mb-3">Run Agent</h3>
          <TaxAgentRunner agentId={agent.id} buttonLabel="Run Agent" buttonSize="default" />
        </CardContent>
      </Card>

      {runs.length > 0 && (
        <Card className="bg-tm-bg-card border-tm-border">
          <CardContent className="p-5">
            <h3 className="section-title mb-3">Recent Runs</h3>
            <div className="space-y-2">
              {runs.slice(0, 10).map(run => (
                <div key={run.id} className="flex items-center justify-between py-2 border-b border-tm-border/50 last:border-0">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-tm-text-muted" />
                    <span className="text-xs text-tm-text-secondary truncate max-w-[300px]">{run.input.slice(0, 100)}...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-[10px] ${run.status === 'complete' ? 'bg-tm-tax-savings/15 text-tm-tax-savings' : run.status === 'error' ? 'bg-tm-tax-liability/15 text-tm-tax-liability' : 'bg-tm-tax-opportunity/15 text-tm-tax-opportunity'}`}>
                      {run.status}
                    </Badge>
                    {run.durationMs && <span className="text-[10px] text-tm-text-muted font-data">{(run.durationMs / 1000).toFixed(1)}s</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
