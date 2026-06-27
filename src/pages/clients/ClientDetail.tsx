import { useParams, useNavigate } from 'react-router-dom';
import { useClientStore } from '@/stores/useClientStore';
import { useReturnStore } from '@/stores/useReturnStore';
import { ENTITY_TYPES } from '@/lib/tax/constants';
import { fmtTax } from '@/lib/tax/calculations';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FileText, Lightbulb, FolderOpen, Edit, User, Mail, Phone, MapPin } from 'lucide-react';

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const client = useClientStore(s => s.clients[id ?? '']);
  const returns = useReturnStore(s => s.getByClient(id ?? ''));

  if (!client) return <div className="text-center py-20 text-tm-text-muted">Client not found</div>;

  const entity = ENTITY_TYPES[client.entityType];

  return (
    <div className="max-w-[1000px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button variant="ghost" size="sm" className="text-xs text-tm-text-secondary mb-2 px-0 hover:text-tm-text-primary" onClick={() => navigate('/clients')}>
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Clients
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-tm-text-primary">{client.legalName}</h1>
            <Badge style={{ backgroundColor: entity.color + '20', color: entity.color }}>{entity.label}</Badge>
            {client.priorityClient && <Badge className="bg-tm-tax-opportunity/15 text-tm-tax-opportunity">Priority</Badge>}
          </div>
          <div className="text-sm text-tm-text-secondary mt-1 font-data">{client.clientNumber} · Tax Year {client.taxYear}</div>
        </div>
        <Button variant="outline" size="sm" className="border-tm-border bg-tm-bg-elevated gap-1.5">
          <Edit className="w-3.5 h-3.5" /> Edit
        </Button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-tm-bg-card border-tm-border">
          <CardContent className="p-4 space-y-3">
            <h3 className="text-xs font-semibold text-tm-text-muted uppercase tracking-wider">Contact Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-tm-text-secondary"><User className="w-3.5 h-3.5" /> {client.primaryContactName}</div>
              <div className="flex items-center gap-2 text-tm-text-secondary"><Mail className="w-3.5 h-3.5" /> {client.primaryEmail}</div>
              <div className="flex items-center gap-2 text-tm-text-secondary"><Phone className="w-3.5 h-3.5" /> {client.primaryPhone}</div>
              <div className="flex items-center gap-2 text-tm-text-secondary"><MapPin className="w-3.5 h-3.5" /> {client.mailingAddress}, {client.city}, {client.state} {client.zip}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-tm-bg-card border-tm-border">
          <CardContent className="p-4 space-y-3">
            <h3 className="text-xs font-semibold text-tm-text-muted uppercase tracking-wider">Tax Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-tm-text-secondary">Form:</span><span className="font-data text-tm-text-primary">{entity.form}</span></div>
              <div className="flex justify-between"><span className="text-tm-text-secondary">Filing Deadline:</span><span className="font-data text-tm-text-primary">{entity.deadline}</span></div>
              <div className="flex justify-between"><span className="text-tm-text-secondary">EIN:</span><span className="font-data text-tm-text-primary">{client.ein || 'N/A'}</span></div>
              {client.statesFilingIn && <div className="flex justify-between"><span className="text-tm-text-secondary">States:</span><span className="text-tm-text-primary">{client.statesFilingIn.join(', ')}</span></div>}
              <div className="flex justify-between"><span className="text-tm-text-secondary">CPA:</span><span className="text-tm-text-primary">{client.responsibleCPA}</span></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-tm-bg-card border-tm-border">
          <CardContent className="p-4 space-y-3">
            <h3 className="text-xs font-semibold text-tm-text-muted uppercase tracking-wider">Financial Snapshot</h3>
            <div className="space-y-2 text-sm">
              {client.lastYearGrossIncome && <div className="flex justify-between"><span className="text-tm-text-secondary">Gross Income:</span><span className="font-data text-tm-text-number">{fmtTax.dollar(client.lastYearGrossIncome)}</span></div>}
              {client.lastYearTaxPaid && <div className="flex justify-between"><span className="text-tm-text-secondary">Tax Paid:</span><span className="font-data text-tm-tax-liability">{fmtTax.dollar(client.lastYearTaxPaid)}</span></div>}
              {client.hourlyRate && <div className="flex justify-between"><span className="text-tm-text-secondary">Hourly Rate:</span><span className="font-data text-tm-text-primary">${client.hourlyRate}/hr</span></div>}
              {client.ytdBilledAmount && <div className="flex justify-between"><span className="text-tm-text-secondary">YTD Billed:</span><span className="font-data text-tm-tax-savings">{fmtTax.dollar(client.ytdBilledAmount)}</span></div>}
              <div className="flex justify-between"><span className="text-tm-text-secondary">Complexity:</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`w-3 h-3 rounded-sm ${i <= client.complexityScore ? 'bg-tm-brand' : 'bg-tm-bg-elevated border border-tm-border'}`} />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="returns" className="w-full">
        <TabsList className="bg-tm-bg-surface border border-tm-border">
          <TabsTrigger value="returns" className="data-[state=active]:bg-tm-brand data-[state=active]:text-white text-xs gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Returns ({returns.length})
          </TabsTrigger>
          <TabsTrigger value="planning" className="data-[state=active]:bg-tm-brand data-[state=active]:text-white text-xs gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" /> Planning
          </TabsTrigger>
          <TabsTrigger value="elections" className="data-[state=active]:bg-tm-brand data-[state=active]:text-white text-xs gap-1.5">
            <FolderOpen className="w-3.5 h-3.5" /> Elections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="returns" className="mt-4">
          <div className="space-y-2">
            {returns.map(r => (
              <Card key={r.id} className="bg-tm-bg-card border-tm-border cursor-pointer hover:border-tm-border-mid transition-colors" onClick={() => navigate(`/returns/${r.id}`)}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-tm-text-primary">{r.form} · Tax Year {r.taxYear}</div>
                    <div className="text-xs text-tm-text-secondary mt-0.5">Status: {r.status} · Prepared by: {r.preparedBy || 'Unassigned'}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    {r.taxDueOrRefund !== undefined && r.taxDueOrRefund !== 0 && (
                      <div className={`text-sm font-data ${r.taxDueOrRefund > 0 ? 'text-tm-tax-liability' : 'text-tm-tax-savings'}`}>
                        {r.taxDueOrRefund > 0 ? 'Due: ' : 'Refund: '}
                        {fmtTax.dollar(Math.abs(r.taxDueOrRefund))}
                      </div>
                    )}
                    <Badge className="text-[10px] bg-tm-bg-elevated">{r.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            {returns.length === 0 && <div className="text-center py-8 text-tm-text-muted text-sm">No returns on file for this client.</div>}
          </div>
        </TabsContent>

        <TabsContent value="planning" className="mt-4">
          <Card className="bg-tm-bg-card border-tm-border">
            <CardContent className="p-4">
              <p className="text-sm text-tm-text-secondary">{client.notes || 'No planning notes available.'}</p>
              {client.electionsOnFile.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-tm-text-muted uppercase mb-2">Elections on File</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {client.electionsOnFile.map((e, i) => (
                      <Badge key={i} className="text-[10px] bg-tm-ai-dim text-tm-brand-text">{e}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="elections" className="mt-4">
          <Card className="bg-tm-bg-card border-tm-border">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {client.electionsOnFile.map((e, i) => (
                  <div key={i} className="bg-tm-bg-elevated border border-tm-border rounded-md px-3 py-2 text-xs text-tm-text-primary">{e}</div>
                ))}
                {client.electionsOnFile.length === 0 && <p className="text-sm text-tm-text-muted">No elections on file.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
