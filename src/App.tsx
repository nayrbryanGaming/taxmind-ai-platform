import { useEffect, useState } from 'react';
import AppRouter from './router';
import { seedAllData } from './data/seedData';

export default function App() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      seedAllData();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn('Seed error:', msg);
    }
  }, []);

  if (error) {
    return (
      <div className="h-screen w-screen bg-tm-bg-base flex items-center justify-center p-8">
        <div className="text-center max-w-lg">
          <div className="text-xl font-display font-semibold text-tm-brand mb-4">TaxMind AI</div>
          <div className="text-sm text-tm-tax-liability bg-tm-tax-liability/10 rounded-lg p-4 mb-4">{error}</div>
          <button onClick={() => setError(null)} className="text-xs text-tm-brand-text underline">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div onClick={() => {}} onError={(e) => { setError(String(e)); }}>
      <AppRouter />
    </div>
  );
}
