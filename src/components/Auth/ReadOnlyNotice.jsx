import { Eye } from 'lucide-react';

export function ReadOnlyNotice({ description = 'Войдите как администратор, чтобы изменять данные.' }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-panel backdrop-blur-xl">
      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10 text-sky-300">
        <Eye className="h-5 w-5" />
      </div>
      <div>
        <p className="font-medium text-slate-100">Режим просмотра</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">{description}</p>
      </div>
    </div>
  );
}
