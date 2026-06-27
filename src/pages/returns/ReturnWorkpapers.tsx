import { useParams, useNavigate } from 'react-router-dom';
import { useReturnStore } from '@/stores/useReturnStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileSpreadsheet } from 'lucide-react';

export default function ReturnWorkpapers() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ret = useReturnStore(s => s.returns[id ?? '']);

  return (
    <div className="max-w-[1000px] mx-auto space-y-5">
      <Button variant="ghost" size="sm" className="text-xs text-tm-text-secondary px-0" onClick={() => navigate(`/returns/${id}`)}>
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Return
      </Button>
      <h1 className="text-2xl font-semibold text-tm-text-primary">Workpapers · {ret?.clientName}</h1>
      <Card className="bg-tm-bg-card border-tm-border">
        <CardContent className="p-8 text-center">
          <FileSpreadsheet className="w-12 h-12 text-tm-text-muted mx-auto mb-3" />
          <p className="text-sm text-tm-text-muted">Workpaper management integration with your firm DMS.</p>
          <p className="text-xs text-tm-text-muted mt-1">Form {ret?.form} · Tax Year {ret?.taxYear}</p>
        </CardContent>
      </Card>
    </div>
  );
}
