import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReturnStore } from '@/stores/useReturnStore';
import { useClientStore } from '@/stores/useClientStore';
import { type ReturnStatus } from '@/lib/tax/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, FilePlus } from 'lucide-react';

export default function ReturnNew() {
  const navigate = useNavigate();
  const addReturn = useReturnStore(s => s.addReturn);
  const clients = Object.values(useClientStore(s => s.clients)).filter(c => c.status === 'ACTIVE');
  const [clientId, setClientId] = useState('');
  const [form, setForm] = useState({ taxYear: 2024, form: '1040', status: 'NOT_STARTED' as ReturnStatus, originalDueDate: '2025-04-15' });

  const handleSubmit = () => {
    if (!clientId) return;
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    const id = addReturn({
      clientId,
      clientName: client.legalName,
      entityType: client.entityType,
      taxYear: form.taxYear,
      status: form.status,
      form: form.form,
      originalDueDate: form.originalDueDate,
      prepNotes: '', reviewNotes: '', clientNotes: '',
      extensionFiled: false,
      aiAnalysisDone: false,
      tags: [],
    });
    navigate(`/returns/${id}`);
  };

  return (
    <div className="max-w-[600px] mx-auto space-y-5">
      <Button variant="ghost" size="sm" className="text-xs text-tm-text-secondary px-0" onClick={() => navigate('/returns')}>
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Returns
      </Button>
      <div className="flex items-center gap-3">
        <FilePlus className="w-6 h-6 text-tm-brand" />
        <h1 className="text-2xl font-semibold text-tm-text-primary">New Return / Engagement</h1>
      </div>
      <Card className="bg-tm-bg-card border-tm-border">
        <CardContent className="p-5 space-y-4">
          <div>
            <Label className="form-label">Client *</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger className="input-tax"><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent className="bg-tm-bg-elevated border-tm-border">
                {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.legalName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="form-label">Tax Year</Label>
              <Input type="number" value={form.taxYear} onChange={e => setForm({ ...form, taxYear: Number(e.target.value) })} className="input-tax font-data" />
            </div>
            <div>
              <Label className="form-label">Form</Label>
              <Select value={form.form} onValueChange={v => setForm({ ...form, form: v })}>
                <SelectTrigger className="input-tax"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-tm-bg-elevated border-tm-border">
                  {['1040', '1120', '1120-S', '1065', '1041', '990'].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="form-label">Original Due Date</Label>
            <Input type="date" value={form.originalDueDate} onChange={e => setForm({ ...form, originalDueDate: e.target.value })} className="input-tax" />
          </div>
          <Button className="w-full bg-tm-brand hover:bg-tm-brand-mid" onClick={handleSubmit} disabled={!clientId}>Create Return</Button>
        </CardContent>
      </Card>
    </div>
  );
}
