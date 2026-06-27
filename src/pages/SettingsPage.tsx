import { Card, CardContent } from '@/components/ui/card';
import { Settings, User, Bell, Shield, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-[800px] mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-tm-brand" />
        <h1 className="text-2xl font-semibold text-tm-text-primary">Settings</h1>
      </div>
      <div className="grid gap-4">
        {[
          { icon: User, title: 'Firm Profile', desc: 'Apex CPA Group · 87 active clients' },
          { icon: Bell, title: 'Notifications', desc: 'Deadline alerts, AI analysis complete' },
          { icon: Shield, title: 'API Keys', desc: 'Anthropic API configuration' },
          { icon: Database, title: 'Data Management', desc: 'Export, backup, reset seed data' },
        ].map(s => (
          <Card key={s.title} className="bg-tm-bg-card border-tm-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-tm-bg-elevated flex items-center justify-center">
                <s.icon className="w-5 h-5 text-tm-brand" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-tm-text-primary">{s.title}</h3>
                <p className="text-xs text-tm-text-secondary">{s.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
