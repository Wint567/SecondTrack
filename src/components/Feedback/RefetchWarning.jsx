export function RefetchWarning({
  message = 'Показаны сохранённые данные: обновить их не удалось.',
  onRetry,
}) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm text-amber-100 sm:flex-row sm:items-center sm:justify-between"
    >
      <p>{message}</p>
      {onRetry ? (
        <button type="button" className="button-secondary flex-none" onClick={() => onRetry()}>
          Обновить снова
        </button>
      ) : null}
    </div>
  );
}
