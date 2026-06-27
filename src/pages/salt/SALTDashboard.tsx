import { Card, CardContent } from '@/components/ui/card';
import { Map, Building2, Users } from 'lucide-react';

export default function SALTDashboard() {
  return (
    <div className="max-w-[1000px] mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Map className="w-6 h-6 text-tm-brand" />
        <h1 className="text-2xl font-semibold text-tm-text-primary">State & Local Tax (SALT)</h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'States with Nexus', value: '12', icon: Map },
          { label: 'PTET Elections', value: '8', icon: Building2 },
          { label: 'Apportionment Reviews', value: '3', icon: Users },
          { label: 'Conformity Issues', value: '5', icon: Map },
        ].map(kpi => (
          <Card key={kpi.label} className="bg-tm-bg-card border-tm-border">
            <CardContent className="p-4">
              <kpi.icon className="w-4 h-4 text-tm-brand mb-2" />
              <div className="text-2xl font-data font-semibold text-tm-text-number">{kpi.value}</div>
              <div className="text-[10px] text-tm-text-muted uppercase">{kpi.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="bg-tm-bg-card border-tm-border">
        <CardContent className="p-8 text-center">
          <Map className="w-12 h-12 text-tm-text-muted mx-auto mb-3" />
          <p className="text-sm text-tm-text-muted">SALT dashboard with nexus tracking, apportionment analysis, and state conformity monitoring.</p>
        </CardContent>
      </Card>
    </div>
  );
}
