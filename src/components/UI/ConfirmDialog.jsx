export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Подтвердить',
  cancelLabel = 'Отмена',
  isPending = false,
  onConfirm,
  onCancel,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-800/90 bg-slate-900 p-5 shadow-panel">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {description ? <p className="text-sm text-slate-400">{description}</p> : null}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button type="button" className="button-secondary" onClick={onCancel} disabled={isPending}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-100 transition hover:border-rose-400/50 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? 'Удаление...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
