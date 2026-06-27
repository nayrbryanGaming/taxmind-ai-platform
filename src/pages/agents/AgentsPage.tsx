import { useNavigate } from 'react-router-dom';
import { useAgentStore } from '@/stores/useAgentStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, Search, Building2, TrendingDown, ClipboardList, User, Map, Landmark, ShieldAlert, Globe, CalendarDays, ArrowRight } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Search, Building2, TrendingDown, ClipboardList, User, Map, Landmark, ShieldAlert, Globe, CalendarDays,
};

export default function AgentsPage() {
  const navigate = useNavigate();
  const agents = Object.values(useAgentStore(s => s.agents));

  return (
    <div className="max-w-[1200px] mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Bot className="w-6 h-6 text-tm-brand" />
        <div>
          <h1 className="text-2xl font-semibold text-tm-text-primary">AI Tax Agents</h1>
          <p className="text-sm text-tm-text-secondary">10 specialized agents for every phase of the tax lifecycle</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map(agent => {
          const Icon = iconMap[agent.icon] || Bot;
          return (
            <Card key={agent.id} className="bg-tm-bg-card border-tm-border hover:border-tm-brand/40 transition-all group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-tm-ai-dim flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-tm-brand-text" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-tm-text-primary">{agent.name}</h3>
                      <p className="text-xs text-tm-text-secondary mt-0.5 leading-relaxed">{agent.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="text-[10px] bg-tm-bg-elevated text-tm-text-muted">{agent.specialty}</Badge>
                        {agent.timesRun > 0 && <Badge className="text-[10px] bg-tm-ai-dim text-tm-brand-text">{agent.timesRun} runs</Badge>}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" className="bg-tm-brand hover:bg-tm-brand-mid h-8 w-8 p-0 shrink-0" onClick={() => navigate(`/agents/${agent.id}`)}>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
