export function ChartCard({ title, children }) {
  return (
    <div className="card min-w-0">
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-800/70 pb-3">
        <h3 className="text-base font-semibold leading-tight text-white sm:text-lg">{title}</h3>
      </div>
      <div className="h-72 min-w-0 sm:h-80">{children}</div>
    </div>
  );
}
