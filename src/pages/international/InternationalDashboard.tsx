import { Card, CardContent } from '@/components/ui/card';
import { Globe, FileWarning, DollarSign } from 'lucide-react';

export default function InternationalDashboard() {
  return (
    <div className="max-w-[1000px] mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Globe className="w-6 h-6 text-tm-brand" />
        <h1 className="text-2xl font-semibold text-tm-text-primary">International Tax</h1>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Foreign Entities', value: '4', icon: Globe },
          { label: 'FBAR Required', value: '2', icon: FileWarning },
          { label: 'GILTI Exposure', value: '$340K', icon: DollarSign },
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
          <Globe className="w-12 h-12 text-tm-text-muted mx-auto mb-3" />
          <p className="text-sm text-tm-text-muted">International tax dashboard with GILTI, BEAT, FDII, Subpart F, and foreign tax credit analysis.</p>
        </CardContent>
      </Card>
    </div>
  );
}
