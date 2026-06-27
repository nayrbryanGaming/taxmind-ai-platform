import { useParams, useNavigate } from 'react-router-dom';
import { useClientStore } from '@/stores/useClientStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lightbulb } from 'lucide-react';

export default function ClientPlanning() {
  const { id } = useParams();
  const navigate = useNavigate();
  const client = useClientStore(s => s.clients[id ?? '']);

  return (
    <div className="max-w-[1000px] mx-auto space-y-5">
      <Button variant="ghost" size="sm" className="text-xs text-tm-text-secondary px-0" onClick={() => navigate(`/clients/${id}`)}>
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Client
      </Button>
      <h1 className="text-2xl font-semibold text-tm-text-primary">Tax Planning · {client?.legalName}</h1>
      <Card className="bg-tm-bg-card border-tm-border">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-tm-tax-opportunity" />
            <h2 className="section-title">Planning Notes</h2>
          </div>
          <p className="text-sm text-tm-text-secondary leading-relaxed">{client?.notes || 'No planning notes available.'}</p>
        </CardContent>
      </Card>
    </div>
  );
}
