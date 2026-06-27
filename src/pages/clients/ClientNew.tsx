import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientStore } from '@/stores/useClientStore';
import { ENTITY_TYPES, type EntityType } from '@/lib/tax/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, UserPlus } from 'lucide-react';

export default function ClientNew() {
  const navigate = useNavigate();
  const addClient = useClientStore(s => s.addClient);
  const [form, setForm] = useState({
    legalName: '', primaryContactName: '', primaryEmail: '', primaryPhone: '',
    mailingAddress: '', city: '', state: '', zip: '',
    entityType: 'S_CORP' as EntityType, clientType: 'BUSINESS' as const,
    responsibleCPA: 'Jennifer Walsh', taxYear: 2024,
    notes: '', ein: '', complexityScore: 3 as 1 | 2 | 3 | 4 | 5,
    highNetWorth: false, internationalExposure: false, irsAuditHistory: false, priorityClient: false,
  });

  const handleSubmit = () => {
    if (!form.legalName) return;
    const id = addClient({ ...form, status: 'ACTIVE', electionsOnFile: [], assignedStaff: [], extensionFiled: false, notes: form.notes || '', tags: [] });
    navigate(`/clients/${id}`);
  };

  return (
    <div className="max-w-[800px] mx-auto space-y-5">
      <Button variant="ghost" size="sm" className="text-xs text-tm-text-secondary px-0 hover:text-tm-text-primary" onClick={() => navigate('/clients')}>
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Clients
      </Button>
      <div className="flex items-center gap-3">
        <UserPlus className="w-6 h-6 text-tm-brand" />
        <h1 className="text-2xl font-semibold text-tm-text-primary">New Client Intake</h1>
      </div>

      <Card className="bg-tm-bg-card border-tm-border">
        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="form-label">Legal Name *</Label>
              <Input value={form.legalName} onChange={e => setForm({ ...form, legalName: e.target.value })} className="input-tax" placeholder="Acme Corporation" />
            </div>
            <div>
              <Label className="form-label">Primary Contact</Label>
              <Input value={form.primaryContactName} onChange={e => setForm({ ...form, primaryContactName: e.target.value })} className="input-tax" placeholder="John Smith" />
            </div>
            <div>
              <Label className="form-label">Email</Label>
              <Input value={form.primaryEmail} onChange={e => setForm({ ...form, primaryEmail: e.target.value })} className="input-tax" placeholder="john@acme.com" />
            </div>
            <div>
              <Label className="form-label">Phone</Label>
              <Input value={form.primaryPhone} onChange={e => setForm({ ...form, primaryPhone: e.target.value })} className="input-tax" placeholder="(555) 123-4567" />
            </div>
            <div>
              <Label className="form-label">Entity Type</Label>
              <Select value={form.entityType} onValueChange={v => setForm({ ...form, entityType: v as EntityType })}>
                <SelectTrigger className="input-tax"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-tm-bg-elevated border-tm-border">
                  {Object.entries(ENTITY_TYPES).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="form-label">EIN</Label>
              <Input value={form.ein} onChange={e => setForm({ ...form, ein: e.target.value })} className="input-tax" placeholder="XX-XXXXXXX" />
            </div>
          </div>

          <div>
            <Label className="form-label">Mailing Address</Label>
            <Input value={form.mailingAddress} onChange={e => setForm({ ...form, mailingAddress: e.target.value })} className="input-tax" placeholder="123 Main Street" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="form-label">City</Label>
              <Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="input-tax" placeholder="Austin" />
            </div>
            <div>
              <Label className="form-label">State</Label>
              <Input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="input-tax" placeholder="TX" maxLength={2} />
            </div>
            <div>
              <Label className="form-label">ZIP</Label>
              <Input value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} className="input-tax" placeholder="78701" />
            </div>
          </div>

          <div>
            <Label className="form-label">Notes</Label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="input-tax w-full min-h-[80px] resize-y" placeholder="Client notes, special considerations..." />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" className="border-tm-border bg-tm-bg-elevated text-tm-text-primary hover:bg-tm-bg-overlay" onClick={() => navigate('/clients')}>Cancel</Button>
            <Button className="bg-tm-brand hover:bg-tm-brand-mid" onClick={handleSubmit} disabled={!form.legalName}>
              Create Client
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
