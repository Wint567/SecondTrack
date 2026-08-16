export function ToastMessage({ message, tone = 'info', onClose }) {
  if (!message) {
    return null;
  }

  const toneClass =
    tone === 'error'
      ? 'border-rose-500/30 bg-rose-500/10 text-rose-100'
      : 'border-sky-400/25 bg-sky-400/10 text-sky-100';

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      aria-live={tone === 'error' ? 'assertive' : 'polite'}
      className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm"
    >
      <div className={`rounded-2xl border px-4 py-3 shadow-panel backdrop-blur-xl ${toneClass}`}>
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm">{message}</p>
          <button type="button" className="text-xs font-semibold text-current opacity-70 hover:opacity-100" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
