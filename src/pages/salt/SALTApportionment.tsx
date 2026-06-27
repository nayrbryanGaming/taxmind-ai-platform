import { Card, CardContent } from '@/components/ui/card';
import { PieChart } from 'lucide-react';

export default function SALTApportionment() {
  return (
    <div className="max-w-[800px] mx-auto space-y-5">
      <h1 className="text-2xl font-semibold text-tm-text-primary flex items-center gap-2"><PieChart className="w-6 h-6 text-tm-brand" /> Apportionment Calculator</h1>
      <Card className="bg-tm-bg-card border-tm-border">
        <CardContent className="p-8 text-center">
          <PieChart className="w-12 h-12 text-tm-text-muted mx-auto mb-3" />
          <p className="text-sm text-tm-text-muted">Three-factor and single-factor apportionment calculation across all states.</p>
        </CardContent>
      </Card>
    </div>
  );
}
