import clsx from 'clsx';
import { SOLD_STATUS } from '../../utils/constants';

const STATUS_STYLES = {
  Куплено: 'border-slate-600/70 bg-slate-800/70 text-slate-200 before:bg-slate-300',
  Выставлено: 'border-sky-400/30 bg-sky-400/10 text-sky-100 before:bg-sky-300',
  [SOLD_STATUS]: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100 before:bg-emerald-300',
  Утеряно: 'border-rose-500/30 bg-rose-500/10 text-rose-100 before:bg-rose-400',
};

export function StatusBadge({ status }) {
  return (
    <span
      className={clsx(
        'inline-flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold before:h-1.5 before:w-1.5 before:flex-none before:rounded-full',
        STATUS_STYLES[status] ?? 'border-slate-700 bg-slate-950 text-slate-300 before:bg-slate-500',
      )}
    >
      {status || 'Неизвестно'}
    </span>
  );
}
