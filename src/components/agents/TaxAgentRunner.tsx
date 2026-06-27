import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useAgentStore } from '@/stores/useAgentStore';
import { Bot, Send, Clock, FileText } from 'lucide-react';

interface TaxAgentRunnerProps {
  agentId: string;
  contextData?: Record<string, unknown>;
  buttonLabel?: string;
  buttonSize?: 'sm' | 'default';
}

export default function TaxAgentRunner({ agentId, contextData, buttonLabel = 'Run Agent', buttonSize = 'sm' }: TaxAgentRunnerProps) {
  const { agents, isRunning, currentRunId, addRun, completeRun, errorRun, incrementRunCount } = useAgentStore();
  const [input, setInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const agent = agents[agentId];
  if (!agent) return null;

  const runAgent = useCallback(async () => {
    const userContent = input || JSON.stringify({ instruction: 'Analyze the following tax data:', taxYear: 2024, data: contextData }, null, 2);
    const runId = addRun({ agentId, agentName: agent.name, status: 'running', input: userContent });
    const startTime = Date.now();

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new Error('Anthropic API key not configured. Set VITE_ANTHROPIC_API_KEY in your environment.');
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: agent.systemPrompt,
          messages: [{ role: 'user', content: userContent }],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const rawText = data.content?.map((b: { type: string; text?: string }) => b.text ?? '').filter(Boolean).join('') ?? '';
      const cleanText = rawText.replace(/^```(?:json)?\s*/m, '').replace(/\s*```$/m, '').trim();
      
      const duration = Date.now() - startTime;
      completeRun(runId, cleanText, duration);
      incrementRunCount(agentId);
      setResult(cleanText);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      errorRun(runId, msg);
      setResult(`Error: ${msg}`);
    }
  }, [agent, input, contextData, addRun, completeRun, errorRun, incrementRunCount]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          size={buttonSize}
          onClick={() => showInput ? runAgent() : setShowInput(true)}
          disabled={isRunning}
          className="bg-tm-brand hover:bg-tm-brand-mid gap-1.5"
        >
          {isRunning && currentRunId ? <Spinner className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
          {isRunning ? 'Running...' : buttonLabel}
        </Button>
        {agent.timesRun > 0 && (
          <Badge variant="outline" className="text-[10px] border-tm-border text-tm-text-muted">
            <Clock className="w-3 h-3 mr-1" /> {agent.timesRun} runs
          </Badge>
        )}
      </div>

      {showInput && (
        <div className="space-y-2">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter additional context or instructions for the agent..."
            className="bg-tm-bg-elevated border-tm-border text-tm-text-primary text-sm min-h-[80px]"
          />
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={runAgent} disabled={isRunning} className="bg-tm-brand hover:bg-tm-brand-mid gap-1">
              <Send className="w-3.5 h-3.5" /> Submit
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowInput(false)} className="text-tm-text-secondary hover:text-tm-text-primary">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {result && (
        <Card className="bg-tm-bg-elevated border-tm-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-tm-brand" />
            <span className="text-xs font-medium text-tm-brand-text">Agent Output</span>
          </div>
          <pre className="text-xs text-tm-text-secondary whitespace-pre-wrap overflow-auto max-h-96 font-data leading-relaxed">{result}</pre>
        </Card>
      )}
    </div>
  );
}
