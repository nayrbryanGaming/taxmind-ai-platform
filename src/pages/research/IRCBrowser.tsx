import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, BookOpen } from 'lucide-react';

const IRC_SECTIONS = [
  { num: '§61', title: 'Gross Income Defined', category: 'Income' },
  { num: '§162', title: 'Trade or Business Expenses', category: 'Deductions' },
  { num: '§163', title: 'Interest', category: 'Deductions' },
  { num: '§164', title: 'Taxes', category: 'Deductions' },
  { num: '§165', title: 'Losses', category: 'Deductions' },
  { num: '§166', title: 'Bad Debts', category: 'Deductions' },
  { num: '§167', title: 'Depreciation', category: 'Depreciation' },
  { num: '§168', title: 'Accelerated Cost Recovery (MACRS)', category: 'Depreciation' },
  { num: '§168(k)', title: 'Bonus Depreciation', category: 'Depreciation' },
  { num: '§170', title: 'Charitable Contributions', category: 'Deductions' },
  { num: '§174', title: 'Research & Experimental', category: 'Deductions' },
  { num: '§179', title: 'Election to Expense', category: 'Depreciation' },
  { num: '§179D', title: 'Energy Efficient Buildings', category: 'Credits' },
  { num: '§197', title: 'Amortization of Intangibles', category: 'Depreciation' },
  { num: '§199A', title: 'Qualified Business Income', category: 'Deductions' },
  { num: '§267', title: 'Related Party Transactions', category: 'General' },
  { num: '§274', title: 'Entertainment & Meals', category: 'Deductions' },
  { num: '§280A', title: 'Home Office', category: 'Deductions' },
  { num: '§280F', title: 'Luxury Auto Limits', category: 'Depreciation' },
  { num: '§351', title: 'Tax-Free Corporate Formation', category: 'Entity' },
  { num: '§401', title: 'Qualified Plans', category: 'Retirement' },
  { num: '§408', title: 'IRAs', category: 'Retirement' },
  { num: '§1202', title: 'Qualified Small Business Stock', category: 'Gains' },
  { num: '§1361', title: 'S Corporation Definition', category: 'Entity' },
  { num: '§2001', title: 'Estate Tax', category: 'Estate' },
  { num: '§2010', title: 'Unified Credit', category: 'Estate' },
  { num: '§2503', title: 'Annual Gift Exclusion', category: 'Estate' },
];

export default function IRCBrowser() {
  const [query, setQuery] = useState('');
  const filtered = IRC_SECTIONS.filter(s =>
    s.num.toLowerCase().includes(query.toLowerCase()) ||
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.category.toLowerCase().includes(query.toLowerCase())
  );

  const categories = [...new Set(filtered.map(s => s.category))];

  return (
    <div className="max-w-[900px] mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <BookOpen className="w-6 h-6 text-tm-brand" />
        <div>
          <h1 className="text-2xl font-semibold text-tm-text-primary">IRC Code Browser</h1>
          <p className="text-sm text-tm-text-secondary">Quick reference for commonly cited code sections</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tm-text-muted" />
        <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by section number, title, or category..." className="pl-10 bg-tm-bg-elevated border-tm-border" />
      </div>

      <div className="space-y-4">
        {categories.map(cat => (
          <div key={cat}>
            <h3 className="text-xs font-semibold text-tm-text-muted uppercase tracking-wider mb-2">{cat}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {filtered.filter(s => s.category === cat).map(s => (
                <Card key={s.num} className="bg-tm-bg-card border-tm-border hover:border-tm-border-mid transition-all cursor-pointer">
                  <CardContent className="p-3 flex items-center gap-3">
                    <span className="text-xs font-data text-tm-brand-text bg-tm-ai-dim px-1.5 py-0.5 rounded">{s.num}</span>
                    <span className="text-sm text-tm-text-primary">{s.title}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
