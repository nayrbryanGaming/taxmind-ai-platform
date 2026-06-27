import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useControversyStore } from '@/stores/useControversyStore';
import { useClientStore } from '@/stores/useClientStore';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus } from 'lucide-react';

export default function ControversyNew() {
  const navigate = useNavigate();
  const addNotice = useControversyStore(s => s.addNotice);
  const clients = Object.values(useClientStore(s => s.clients)).filter(c => c.status === 'ACTIVE');
  const [clientId, setClientId] = useState('');
  const [form, setForm] = useState({
    noticeType: 'CP2000' as const, taxYear: 2024, amountInDispute: 0,
    dateReceived: new Date().toISOString().split('T')[0],
    responseDueDate: '', irsPosition: '', taxpayerPosition: '',
    assignedCPA: 'Jennifer Walsh', status: 'OPEN' as const,
  });

  const handleSubmit = () => {
    if (!clientId) return;
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    const id = addNotice({ ...form, clientId, clientName: client.legalName, notes: '', noticeNumber: `NOT-${Date.now()}` });
    navigate(`/controversy/${id}`);
  };

  return (
    <div className="max-w-[600px] mx-auto space-y-5">
      <Button variant="ghost" size="sm" className="text-xs text-tm-text-secondary px-0" onClick={() => navigate('/controversy')}>
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
      </Button>
      <h1 className="text-2xl font-semibold text-tm-text-primary flex items-center gap-2"><Plus className="w-6 h-6 text-tm-brand" /> New IRS Notice</h1>
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
              <Label className="form-label">Notice Type</Label>
              <Select value={form.noticeType} onValueChange={v => setForm({ ...form, noticeType: v as typeof form.noticeType })}>
                <SelectTrigger className="input-tax"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-tm-bg-elevated border-tm-border">
                  {['CP2000', 'CP3219', 'CP501', 'CP503', 'CP504', 'CP90', '30_DAY_LETTER', '90_DAY_LETTER', 'AUDIT', 'OTHER'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label className="form-label">Tax Year</Label><Input type="number" value={form.taxYear} onChange={e => setForm({ ...form, taxYear: Number(e.target.value) })} className="input-tax font-data" /></div>
          </div>
          <div><Label className="form-label">Amount in Dispute</Label><Input type="number" value={form.amountInDispute} onChange={e => setForm({ ...form, amountInDispute: Number(e.target.value) })} className="input-tax font-data" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="form-label">Date Received</Label><Input type="date" value={form.dateReceived} onChange={e => setForm({ ...form, dateReceived: e.target.value })} className="input-tax" /></div>
            <div><Label className="form-label">Response Due Date</Label><Input type="date" value={form.responseDueDate} onChange={e => setForm({ ...form, responseDueDate: e.target.value })} className="input-tax" /></div>
          </div>
          <Button className="w-full bg-tm-brand hover:bg-tm-brand-mid" onClick={handleSubmit} disabled={!clientId}>Add Notice</Button>
        </CardContent>
      </Card>
    </div>
  );
}
