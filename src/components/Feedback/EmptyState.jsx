export function EmptyState({ title, description, action }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-6 text-center">
      <div className="max-w-md space-y-3">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
        {action}
      </div>
    </div>
  );
}
