import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

const strategies = [
  { name: 'Annual Exclusion Gifting', desc: '$18,000/yr per donee — $144,000/yr for 4 children + spouses', taxSavings: '$57,600/yr' },
  { name: 'Spousal Lifetime Access Trust (SLAT)', desc: 'Irrevocable trust for spouse — use exemption before sunset', taxSavings: '$2.7M+' },
  { name: 'Grantor Retained Annuity Trust (GRAT)', desc: 'Transfer appreciation above §7520 rate tax-free', taxSavings: '$500K-$2M' },
  { name: 'ILIT (Life Insurance Trust)', desc: 'Exclude death benefit from taxable estate', taxSavings: 'Leveraged transfer' },
  { name: 'Charitable Remainder Trust', desc: 'Donate appreciated asset — no capital gains + income stream', taxSavings: '$200K-$1M' },
  { name: '529 Plan Front-Loading', desc: '$90,000 per donee (5-year averaging) gift-tax free', taxSavings: '$36,000/yr' },
];

export default function EstateStrategies() {
  return (
    <div className="max-w-[900px] mx-auto space-y-5">
      <h1 className="text-2xl font-semibold text-tm-text-primary flex items-center gap-2"><Lightbulb className="w-6 h-6 text-tm-brand" /> Estate Planning Strategies</h1>
      <div className="space-y-3">
        {strategies.map((s, i) => (
          <Card key={i} className="bg-tm-bg-card border-tm-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-tm-text-primary">{s.name}</h3>
                  <p className="text-xs text-tm-text-secondary mt-0.5">{s.desc}</p>
                </div>
                <span className="text-xs font-data text-tm-tax-savings shrink-0">{s.taxSavings}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
