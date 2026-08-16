import { LoaderCircle } from 'lucide-react';

export function LoadingState({ label = 'Загрузка...' }) {
  return (
    <div role="status" aria-live="polite" className="flex min-h-[240px] items-center justify-center rounded-2xl border border-slate-800/90 bg-slate-900/60 shadow-panel backdrop-blur-xl">
      <div className="flex items-center gap-3 text-slate-300">
        <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin text-sky-400" />
        <span>{label}</span>
      </div>
    </div>
  );
}
