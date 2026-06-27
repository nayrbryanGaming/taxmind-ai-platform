import { useParams, useNavigate } from 'react-router-dom';
import { useReturnStore } from '@/stores/useReturnStore';
import { RETURN_STATUSES, ENTITY_TYPES } from '@/lib/tax/constants';
import { fmtTax } from '@/lib/tax/calculations';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, AlertTriangle, Bot, CheckCircle } from 'lucide-react';
import TaxAgentRunner from '@/components/agents/TaxAgentRunner';

export default function ReturnDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ret = useReturnStore(s => s.returns[id ?? '']);
  const advanceStatus = useReturnStore(s => s.advanceStatus);

  if (!ret) return <div className="text-center py-20 text-tm-text-muted">Return not found</div>;

  const status = RETURN_STATUSES[ret.status];
  const entity = ENTITY_TYPES[ret.entityType];

  return (
    <div className="max-w-[1000px] mx-auto space-y-5">
      <Button variant="ghost" size="sm" className="text-xs text-tm-text-secondary px-0" onClick={() => navigate('/returns')}>
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Returns
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-semibold text-tm-text-primary">{ret.clientName}</h1>
            <Badge style={{ backgroundColor: entity.color + '20', color: entity.color }}>{entity.form}</Badge>
            <Badge style={{ backgroundColor: status.color + '15', color: status.color }}>{status.label}</Badge>
          </div>
          <div className="text-sm font-data text-tm-text-secondary">{ret.returnNumber} · Tax Year {ret.taxYear}</div>
        </div>
        <div className="flex gap-2">
          {ret.status === 'IN_PROGRESS' && (
            <Button size="sm" className="bg-tm-entity-scorp hover:bg-tm-entity-scorp/80 gap-1.5" onClick={() => advanceStatus(ret.id, 'REVIEW', 'Jennifer Walsh')}>
              <CheckCircle className="w-3.5 h-3.5" /> Mark as Review
            </Button>
          )}
          {ret.status === 'REVIEW' && (
            <Button size="sm" className="bg-tm-tax-savings hover:bg-tm-tax-savings/80 gap-1.5" onClick={() => advanceStatus(ret.id, 'FILED', 'Jennifer Walsh')}>
              <CheckCircle className="w-3.5 h-3.5" /> Mark as Filed
            </Button>
          )}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Gross Income', value: ret.grossIncome, color: 'text-tm-text-number' },
          { label: 'Taxable Income', value: ret.taxableIncome, color: 'text-tm-text-number' },
          { label: 'Tax Liability', value: ret.totalTaxLiability, color: 'text-tm-tax-liability' },
          { label: ret.taxDueOrRefund && ret.taxDueOrRefund > 0 ? 'Tax Due' : 'Refund', value: ret.taxDueOrRefund ? Math.abs(ret.taxDueOrRefund) : undefined, color: ret.taxDueOrRefund && ret.taxDueOrRefund > 0 ? 'text-tm-tax-liability' : 'text-tm-tax-savings' },
        ].map(item => item.value !== undefined && (
          <Card key={item.label} className="bg-tm-bg-card border-tm-border">
            <CardContent className="p-3">
              <div className="text-[10px] text-tm-text-muted uppercase">{item.label}</div>
              <div className={`text-lg font-data font-semibold ${item.color}`}>{fmtTax.dollar(item.value)}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-tm-bg-surface border border-tm-border">
          <TabsTrigger value="overview" className="data-[state=active]:bg-tm-brand data-[state=active]:text-white text-xs">Overview</TabsTrigger>
          <TabsTrigger value="ai-analysis" className="data-[state=active]:bg-tm-brand data-[state=active]:text-white text-xs gap-1"><Bot className="w-3.5 h-3.5" /> AI Analysis</TabsTrigger>
          <TabsTrigger value="schedules" className="data-[state=active]:bg-tm-brand data-[state=active]:text-white text-xs">Schedules</TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:bg-tm-brand data-[state=active]:text-white text-xs">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <Card className="bg-tm-bg-card border-tm-border">
            <CardContent className="p-4 space-y-3">
              <h3 className="section-title">Return Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div><span className="text-tm-text-secondary">Form:</span> <span className="font-data text-tm-text-primary">{ret.form}</span></div>
                <div><span className="text-tm-text-secondary">Original Due:</span> <span className="font-data text-tm-text-primary">{ret.originalDueDate}</span></div>
                {ret.extensionDueDate && <div><span className="text-tm-text-secondary">Extension Due:</span> <span className="font-data text-tm-text-primary">{ret.extensionDueDate}</span></div>}
                <div><span className="text-tm-text-secondary">Prepared By:</span> <span className="text-tm-text-primary">{ret.preparedBy || '—'}</span></div>
                <div><span className="text-tm-text-secondary">Reviewed By:</span> <span className="text-tm-text-primary">{ret.reviewedBy || '—'}</span></div>
                {ret.budgetedHours && <div><span className="text-tm-text-secondary">Hours:</span> <span className="font-data text-tm-text-primary">{ret.actualHours ?? 0} / {ret.budgetedHours}</span></div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-analysis" className="mt-4 space-y-4">
          {ret.aiFlags && ret.aiFlags.length > 0 && (
            <Card className="bg-tm-bg-card border-tm-border">
              <CardContent className="p-4 space-y-3">
                <h3 className="section-title flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-tm-tax-opportunity" /> AI Flags</h3>
                {ret.aiFlags.map((flag, i) => (
                  <div key={i} className="flex items-start gap-2 bg-tm-bg-elevated rounded-md p-3">
                    <AlertTriangle className="w-4 h-4 text-tm-tax-opportunity shrink-0 mt-0.5" />
                    <span className="text-xs text-tm-text-secondary leading-relaxed">{flag}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          <TaxAgentRunner
            agentId="agent-return-analyzer"
            contextData={{ returnId: ret.id, form: ret.form, grossIncome: ret.grossIncome, taxableIncome: ret.taxableIncome, status: ret.status }}
            buttonLabel="Run Return Analyzer"
          />
        </TabsContent>

        <TabsContent value="schedules" className="mt-4">
          <Card className="bg-tm-bg-card border-tm-border">
            <CardContent className="p-4">
              {ret.schedulesIncluded && ret.schedulesIncluded.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {ret.schedulesIncluded.map((s, i) => (
                    <Badge key={i} className="text-xs bg-tm-ai-dim text-tm-brand-text px-2 py-1">{s}</Badge>
                  ))}
                </div>
              ) : <p className="text-sm text-tm-text-muted">No schedules listed.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-4 space-y-3">
          {ret.prepNotes && <Card className="bg-tm-bg-card border-tm-border"><CardContent className="p-4"><div className="text-[10px] text-tm-text-muted uppercase mb-1">Prep Notes</div><p className="text-sm text-tm-text-secondary">{ret.prepNotes}</p></CardContent></Card>}
          {ret.reviewNotes && <Card className="bg-tm-bg-card border-tm-border"><CardContent className="p-4"><div className="text-[10px] text-tm-text-muted uppercase mb-1">Review Notes</div><p className="text-sm text-tm-text-secondary">{ret.reviewNotes}</p></CardContent></Card>}
          {ret.clientNotes && <Card className="bg-tm-bg-card border-tm-border"><CardContent className="p-4"><div className="text-[10px] text-tm-text-muted uppercase mb-1">Client Notes</div><p className="text-sm text-tm-text-secondary">{ret.clientNotes}</p></CardContent></Card>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
