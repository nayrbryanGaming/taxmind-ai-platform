import { Card, CardContent } from '@/components/ui/card';
import { TAX_DEADLINES_2025 } from '@/lib/tax/constants';
import { CalendarDays, Clock } from 'lucide-react';

export default function DeadlineCalendar() {
  const today = new Date().toISOString().split('T')[0];
  const upcoming = TAX_DEADLINES_2025.filter(d => d.date >= today).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="max-w-[900px] mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <CalendarDays className="w-6 h-6 text-tm-brand" />
        <h1 className="text-2xl font-semibold text-tm-text-primary">Filing Deadline Calendar</h1>
      </div>
      <div className="space-y-2">
        {upcoming.map((d, i) => {
          const days = Math.ceil((new Date(d.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          const color = days < 7 ? 'border-tm-tax-liability' : days < 30 ? 'border-tm-tax-opportunity' : 'border-tm-border';
          return (
            <Card key={i} className={`bg-tm-bg-card ${color}`}>
              <CardContent className="p-3 flex items-center gap-4">
                <div className="text-center w-16 shrink-0">
                  <div className="text-xs text-tm-text-muted">{new Date(d.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                  <div className="text-lg font-data font-semibold text-tm-text-primary">{new Date(d.date).getDate()}</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-tm-text-primary">{d.description}</div>
                  <div className="text-xs text-tm-brand-text font-data">{d.form}</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-tm-text-muted shrink-0">
                  <Clock className="w-3 h-3" />
                  <span className="font-data">{days}d</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
