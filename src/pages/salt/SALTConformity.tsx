import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function SALTConformity() {
  return (
    <div className="max-w-[800px] mx-auto space-y-5">
      <h1 className="text-2xl font-semibold text-tm-text-primary flex items-center gap-2"><FileText className="w-6 h-6 text-tm-brand" /> State Conformity Tracker</h1>
      <Card className="bg-tm-bg-card border-tm-border">
        <CardContent className="p-8 text-center">
          <FileText className="w-12 h-12 text-tm-text-muted mx-auto mb-3" />
          <p className="text-sm text-tm-text-muted">Track state conformity to federal tax changes including bonus depreciation, §179, GILTI, and §163(j).</p>
        </CardContent>
      </Card>
    </div>
  );
}
