import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FolderOpen } from 'lucide-react';

export default function ClientDocuments() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-[1000px] mx-auto space-y-5">
      <Button variant="ghost" size="sm" className="text-xs text-tm-text-secondary px-0" onClick={() => navigate(`/clients/${id}`)}>
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Client
      </Button>
      <h1 className="text-2xl font-semibold text-tm-text-primary">Document Vault</h1>
      <Card className="bg-tm-bg-card border-tm-border">
        <CardContent className="p-8 text-center">
          <FolderOpen className="w-12 h-12 text-tm-text-muted mx-auto mb-3" />
          <p className="text-sm text-tm-text-muted">Document vault is managed through your firm DMS.</p>
          <p className="text-xs text-tm-text-muted mt-1">Client ID: {id}</p>
        </CardContent>
      </Card>
    </div>
  );
}
