import clsx from 'clsx';

export function StatCard({ label, value, subtext, tone = 'default' }) {
  const valueTone =
    tone === 'positive'
      ? 'text-emerald-300'
      : tone === 'negative'
        ? 'text-rose-300'
        : 'text-white';

  return (
    <div
      className={clsx(
        'card relative flex min-h-[140px] flex-col justify-between overflow-hidden',
        tone === 'positive' && 'border-emerald-400/20 bg-emerald-400/5',
        tone === 'negative' && 'border-rose-400/20 bg-rose-400/5',
      )}
    >
      <div>
        <p className="text-sm font-medium text-slate-400">{label}</p>
        <p className={clsx('mt-3 break-words text-2xl font-semibold tabular-nums sm:text-3xl', valueTone)}>
          {value}
        </p>
      </div>
      {subtext ? <p className="mt-3 text-sm leading-relaxed text-slate-500">{subtext}</p> : null}
    </div>
  );
}
