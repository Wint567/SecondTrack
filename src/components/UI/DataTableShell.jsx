export function DataTableShell({ title, description, children }) {
  return (
    <section className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/40 p-5">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description ? <p className="text-sm text-slate-400">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
