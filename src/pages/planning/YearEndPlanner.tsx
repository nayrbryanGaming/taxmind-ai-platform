import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, Lightbulb } from 'lucide-react';
import TaxAgentRunner from '@/components/agents/TaxAgentRunner';

const strategies = [
  { title: 'Accelerate §179 & Bonus Depreciation', desc: 'Maximize first-year deductions on equipment purchases placed in service by 12/31', savings: '$15,000-$50,000', category: 'Deductions' },
  { title: 'Bunch Charitable Contributions', desc: 'Combine two years of giving into one year via donor-advised fund to exceed standard deduction', savings: '$5,000-$15,000', category: 'Deductions' },
  { title: 'Harvest Capital Losses', desc: 'Sell unrealized losses to offset realized gains; avoid wash sale rule', savings: '$3,000-$10,000', category: 'Investments' },
  { title: 'Maximize Retirement Contributions', desc: '401(k), SEP-IRA, HSA contributions reduce taxable income dollar-for-dollar', savings: '$10,000-$30,000', category: 'Retirement' },
  { title: 'Defer Income to Next Year', desc: 'Cash-basis taxpayers: delay invoicing until January if lower bracket expected', savings: '$5,000-$20,000', category: 'Timing' },
  { title: 'Prepay Deductible Expenses', desc: 'State taxes, mortgage interest, business expenses in December for current-year deduction', savings: '$3,000-$12,000', category: 'Timing' },
  { title: 'S-Corp Reasonable Comp Review', desc: 'Ensure salary is defensible; optimize W-2 vs distribution split before year-end payroll', savings: '$8,000-$25,000', category: 'Entity' },
  { title: 'Qualified Opportunity Zone Investment', desc: 'Defer capital gains by investing in QOZ within 180 days of sale', savings: '10-15% of deferred gain', category: 'Investments' },
];

export default function YearEndPlanner() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <CalendarDays className="w-6 h-6 text-tm-brand" />
        <h1 className="text-2xl font-semibold text-tm-text-primary">Year-End Tax Planning</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strategies.map((s, i) => (
          <Card key={i} className="bg-tm-bg-card border-tm-border hover:border-tm-tax-opportunity/30 transition-all">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-tm-tax-opportunity shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-tm-text-primary">{s.title}</h3>
                    <p className="text-xs text-tm-text-secondary mt-0.5 leading-relaxed">{s.desc}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] bg-tm-bg-elevated text-tm-text-muted px-1.5 py-0.5 rounded">{s.category}</span>
                      <span className="text-[10px] text-tm-tax-savings font-data">{s.savings}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <TaxAgentRunner
        agentId="agent-tax-planning"
        contextData={{ year: 2024, strategies: strategies.length }}
        buttonLabel="Generate Custom Year-End Plan"
      />
    </div>
  );
}
