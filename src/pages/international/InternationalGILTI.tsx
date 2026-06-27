import { Card, CardContent } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

export default function InternationalGILTI() {
  return (
    <div className="max-w-[800px] mx-auto space-y-5">
      <h1 className="text-2xl font-semibold text-tm-text-primary flex items-center gap-2"><Calculator className="w-6 h-6 text-tm-brand" /> GILTI Calculator</h1>
      <Card className="bg-tm-bg-card border-tm-border">
        <CardContent className="p-8 text-center">
          <Calculator className="w-12 h-12 text-tm-text-muted mx-auto mb-3" />
          <p className="text-sm text-tm-text-muted">Global Intangible Low-Taxed Income calculator with §250 deduction, FTC haircut, and high-tax exception.</p>
          <p className="text-xs text-tm-text-muted mt-2">Corporate rate: 10.5% (after 50% deduction) · Individual rate: 37%</p>
        </CardContent>
      </Card>
    </div>
  );
}
