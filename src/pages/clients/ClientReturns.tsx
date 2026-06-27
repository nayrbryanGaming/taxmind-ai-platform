import { useParams, useNavigate } from 'react-router-dom';
import { useReturnStore } from '@/stores/useReturnStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';

export default function ClientReturns() {
  const { id } = useParams();
  const navigate = useNavigate();
  const returns = useReturnStore(s => s.getByClient(id ?? ''));

  return (
    <div className="max-w-[1000px] mx-auto space-y-5">
      <Button variant="ghost" size="sm" className="text-xs text-tm-text-secondary px-0" onClick={() => navigate(`/clients/${id}`)}>
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Client
      </Button>
      <h1 className="text-2xl font-semibold text-tm-text-primary">Client Returns</h1>
      <div className="space-y-2">
        {returns.map(r => (
          <Card key={r.id} className="bg-tm-bg-card border-tm-border cursor-pointer hover:border-tm-border-mid" onClick={() => navigate(`/returns/${r.id}`)}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-tm-brand" />
                <div>
                  <div className="text-sm font-medium text-tm-text-primary">{r.form} · TY {r.taxYear}</div>
                  <div className="text-xs text-tm-text-secondary">{r.status} · {r.schedulesIncluded?.length || 0} schedules</div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-tm-brand-text">View</Button>
            </CardContent>
          </Card>
        ))}
        {returns.length === 0 && <div className="text-center py-12 text-tm-text-muted">No returns found for this client.</div>}
      </div>
    </div>
  );
}
