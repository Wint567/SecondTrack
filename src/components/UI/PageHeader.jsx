export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
      <div className="max-w-3xl space-y-2">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">{eyebrow}</p> : null}
        <h1 className="text-balance text-2xl font-semibold leading-tight text-white sm:text-3xl">{title}</h1>
        {description ? <p className="max-w-2xl text-sm leading-relaxed text-slate-400">{description}</p> : null}
      </div>
      {action ? <div className="w-full shrink-0 sm:w-auto">{action}</div> : null}
    </div>
  );
}
