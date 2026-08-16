export function ErrorState({
  title = 'Что-то пошло не так',
  description = 'Попробуйте ещё раз.',
  onRetry,
}) {
  return (
    <div role="alert" className="flex min-h-[240px] items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-center shadow-panel backdrop-blur-xl">
      <div className="max-w-md space-y-3">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-rose-100/80">{description}</p>
        {onRetry ? (
          <button type="button" className="button-secondary" onClick={() => onRetry()}>
            Попробовать снова
          </button>
        ) : null}
      </div>
    </div>
  );
}
