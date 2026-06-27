import { Card, CardContent } from '@/components/ui/card';
import { Home } from 'lucide-react';

export default function HomeOfficeCalc() {
  return (
    <div className="max-w-[800px] mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Home className="w-6 h-6 text-tm-brand" />
        <h1 className="text-2xl font-semibold text-tm-text-primary">Home Office Calculator (§280A)</h1>
      </div>
      <Card className="bg-tm-bg-card border-tm-border">
        <CardContent className="p-8 text-center">
          <Home className="w-12 h-12 text-tm-text-muted mx-auto mb-3" />
          <p className="text-sm text-tm-text-muted">Home office deduction calculator with square footage method and actual expense method.</p>
          <p className="text-xs text-tm-text-muted mt-2">Simplified method: $5/sq ft up to 300 sq ft ($1,500 max)</p>
        </CardContent>
      </Card>
    </div>
  );
}
