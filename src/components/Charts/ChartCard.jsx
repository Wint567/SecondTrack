import { useId } from 'react';

export function ChartCard({ title, children }) {
  const titleId = useId();

  return (
    <figure className="card min-w-0" aria-labelledby={titleId}>
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-800/70 pb-3">
        <figcaption id={titleId} className="text-base font-semibold leading-tight text-white sm:text-lg">
          {title}
        </figcaption>
      </div>
      <div className="h-72 min-w-0 sm:h-80">{children}</div>
    </figure>
  );
}
