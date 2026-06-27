import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface IRCChipProps {
  section: string;
}

const IRC_SUMMARIES: Record<string, { title: string; summary: string }> = {
  '§61': { title: 'Gross Income Defined', summary: 'Except as otherwise provided, gross income means all income from whatever source derived, including compensation for services, business income, gains, interest, rents, dividends, etc.' },
  '§162': { title: 'Trade or Business Expenses', summary: 'Deduction allowed for all ordinary and necessary expenses paid or incurred during the taxable year in carrying on any trade or business.' },
  '§163': { title: 'Interest Deduction', summary: 'Deduction allowed for all interest paid or accrued on indebtedness, subject to limitations for investment interest and business interest under §163(j).' },
  '§168': { title: 'Accelerated Cost Recovery (MACRS)', summary: 'Modified Accelerated Cost Recovery System for depreciating tangible property. Specifies recovery periods and methods for different classes of property.' },
  '§174': { title: 'Research and Experimental Expenditures', summary: 'Specified R&E expenditures must be capitalized and amortized over 60 months (domestic) or 180 months (foreign) for tax years beginning after 12/31/2021.' },
  '§179': { title: 'Election to Expense', summary: 'Taxpayer may elect to treat cost of certain qualifying property as an expense. 2024 limit: $1,220,000; phase-out begins at $3,050,000.' },
  '§199A': { title: 'Qualified Business Income Deduction', summary: '20% deduction for qualified business income from pass-through entities. Subject to W-2 wage and qualified property limitations above threshold amounts.' },
  '§280A': { title: 'Home Office Deduction', summary: 'Limits deductions for business use of a dwelling unit. Requires exclusive and regular use of a portion of the home as the principal place of business.' },
  '§469': { title: 'Passive Activity Losses', summary: 'Limits deductions from passive activities to income from passive activities. Real estate professionals may qualify for exception.' },
  '§1202': { title: 'Qualified Small Business Stock', summary: 'Non-corporate taxpayers may exclude 100% of gain on QSBS held >5 years. Applies to C-Corp stock with ≤$50M gross assets at issuance.' },
  '§1361': { title: 'S Corporation Definition', summary: 'Defines requirements for S corporation status: domestic corporation, ≤100 shareholders, 1 class of stock, eligible shareholders only.' },
};

export default function IRCChip({ section }: IRCChipProps) {
  const [open, setOpen] = useState(false);
  const cleanSection = section.replace(/[()]/g, '');
  const baseSection = cleanSection.split(/[.(]/)[0];
  const info = IRC_SUMMARIES[baseSection];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span className="irc-chip" onClick={() => setOpen(true)}>
          {section}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-tm-bg-elevated border-tm-border p-3" side="top">
        <div className="text-xs font-data text-tm-brand-text mb-1">{section}</div>
        <div className="text-sm font-semibold text-tm-text-primary mb-1.5">{info?.title || 'IRC Section'}</div>
        <div className="text-xs text-tm-text-secondary leading-relaxed">{info?.summary || 'View full text at IRS.gov for complete statutory language.'}</div>
        <a href={`https://www.law.cornell.edu/uscode/text/26/${baseSection.replace('§', '')}`} target="_blank" rel="noopener noreferrer" className="text-xs text-tm-brand-text hover:underline mt-2 block">
          See full text at Cornell Law
        </a>
      </PopoverContent>
    </Popover>
  );
}

// Auto-parse IRC sections from text
export function parseIRCText(text: string): React.ReactNode[] {
  const parts = text.split(/(§\d+[A-Za-z]?\([^)]*\)|§\d+[A-Za-z]?)/g);
  return parts.map((part, i) => {
    if (part.match(/^§\d+/)) {
      return <IRCChip key={i} section={part} />;
    }
    return <span key={i}>{part}</span>;
  });
}
