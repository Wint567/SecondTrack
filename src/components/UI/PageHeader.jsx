export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6 lg:flex-row lg:items-end">
      <div className="space-y-2">
        {eyebrow ? <p className="text-xs uppercase tracking-[0.28em] text-sky-300">{eyebrow}</p> : null}
        <h1 className="text-3xl font-semibold text-white">{title}</h1>
        {description ? <p className="max-w-2xl text-sm text-slate-400">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
