export function DataTableShell({ title, description, children }) {
  return (
    <section className="min-w-0 space-y-4 rounded-2xl border border-slate-800/90 bg-slate-900/60 p-4 shadow-panel backdrop-blur-xl sm:rounded-3xl sm:p-5 lg:p-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold leading-tight text-white">{title}</h3>
        {description ? <p className="max-w-3xl text-sm leading-relaxed text-slate-400">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
