export function EmptyState({ title, description, action }) {
  return (
    <div className="flex min-h-[190px] items-center justify-center rounded-2xl border border-dashed border-slate-700/80 bg-slate-900/45 p-5 text-center shadow-panel backdrop-blur-xl sm:min-h-[220px] sm:p-6">
      <div className="max-w-md space-y-4">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-700/80 bg-slate-950/55 text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-300/70" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm leading-relaxed text-slate-400">{description}</p>
        </div>
        {action ? <div className="flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}
