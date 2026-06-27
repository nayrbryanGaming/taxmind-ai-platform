import { Card, CardContent } from '@/components/ui/card';
import { Map, CheckCircle } from 'lucide-react';

const states = ['TX', 'CA', 'NY', 'FL', 'IL', 'WA', 'CO', 'TN', 'OK', 'LA', 'AZ', 'NV'];

export default function SALTNexus() {
  return (
    <div className="max-w-[900px] mx-auto space-y-5">
      <h1 className="text-2xl font-semibold text-tm-text-primary flex items-center gap-2"><Map className="w-6 h-6 text-tm-brand" /> Nexus Determination</h1>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {states.map(s => (
          <Card key={s} className="bg-tm-bg-card border-tm-border">
            <CardContent className="p-3 text-center">
              <CheckCircle className="w-4 h-4 text-tm-tax-savings mx-auto mb-1" />
              <div className="text-sm font-data font-semibold text-tm-text-primary">{s}</div>
              <div className="text-[10px] text-tm-text-muted">Nexus confirmed</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
