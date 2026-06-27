import { useParams, useNavigate } from 'react-router-dom';
import { useControversyStore } from '@/stores/useControversyStore';
import { fmtTax } from '@/lib/tax/calculations';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Bot } from 'lucide-react';
import TaxAgentRunner from '@/components/agents/TaxAgentRunner';

export default function ControversyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const notice = useControversyStore(s => s.notices[id ?? '']);

  if (!notice) return <div className="text-center py-20 text-tm-text-muted">Notice not found</div>;

  return (
    <div className="max-w-[900px] mx-auto space-y-5">
      <Button variant="ghost" size="sm" className="text-xs text-tm-text-secondary px-0" onClick={() => navigate('/controversy')}>
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Controversy
      </Button>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-semibold text-tm-text-primary">{notice.noticeType}</h1>
            <Badge className="text-[10px] bg-tm-tax-warning/15 text-tm-tax-warning">{notice.status}</Badge>
          </div>
          <div className="text-sm text-tm-text-secondary">{notice.clientName} · Tax Year {notice.taxYear}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-data text-tm-tax-liability">{fmtTax.dollar(notice.amountInDispute)}</div>
          <div className="text-[10px] text-tm-text-muted">Amount in dispute</div>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-tm-bg-surface border border-tm-border">
          <TabsTrigger value="overview" className="data-[state=active]:bg-tm-brand data-[state=active]:text-white text-xs">Overview</TabsTrigger>
          <TabsTrigger value="response" className="data-[state=active]:bg-tm-brand data-[state=active]:text-white text-xs gap-1"><Bot className="w-3.5 h-3.5" /> Response</TabsTrigger>
          <TabsTrigger value="penalties" className="data-[state=active]:bg-tm-brand data-[state=active]:text-white text-xs">Penalties</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card className="bg-tm-bg-card border-tm-border">
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-tm-text-muted">Date Received:</span> <span className="text-tm-text-primary">{notice.dateReceived}</span></div>
                <div><span className="text-tm-text-muted">Response Due:</span> <span className="text-tm-tax-liability">{notice.responseDueDate}</span></div>
                <div><span className="text-tm-text-muted">Assigned CPA:</span> <span className="text-tm-text-primary">{notice.assignedCPA}</span></div>
                <div><span className="text-tm-text-muted">Penalties:</span> <span className="font-data text-tm-tax-liability">{fmtTax.dollar(notice.penaltiesAssessed ?? 0)}</span></div>
              </div>
              {notice.irsPosition && (
                <div className="mt-3 pt-3 border-t border-tm-border">
                  <div className="text-[10px] text-tm-text-muted uppercase mb-1">IRS Position</div>
                  <p className="text-xs text-tm-text-secondary">{notice.irsPosition}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="response" className="mt-4">
          <TaxAgentRunner
            agentId="agent-irc-controversy"
            contextData={{ noticeType: notice.noticeType, amountInDispute: notice.amountInDispute, taxYear: notice.taxYear, irsPosition: notice.irsPosition }}
            buttonLabel="Draft Response Letter"
          />
        </TabsContent>

        <TabsContent value="penalties" className="mt-4">
          <Card className="bg-tm-bg-card border-tm-border">
            <CardContent className="p-5 space-y-3">
              <h3 className="section-title">Penalty Calculator</h3>
              <div className="text-xs text-tm-text-secondary space-y-1">
                <p>§6651(a)(1) Failure to File: 5%/month (max 25%)</p>
                <p>§6651(a)(2) Failure to Pay: 0.5%/month (max 25%)</p>
                <p>§6662 Accuracy-Related: 20% of underpayment</p>
                <p>§6663 Civil Fraud: 75% of underpayment</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
