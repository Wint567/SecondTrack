import clsx from 'clsx';

export function StatCard({ label, value, subtext, tone = 'default' }) {
  return (
    <div
      className={clsx(
        'card relative overflow-hidden',
        tone === 'positive' && 'border-emerald-400/20 bg-emerald-400/5',
        tone === 'negative' && 'border-rose-400/20 bg-rose-400/5',
      )}
    >
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      {subtext ? <p className="mt-2 text-sm text-slate-500">{subtext}</p> : null}
    </div>
  );
}
