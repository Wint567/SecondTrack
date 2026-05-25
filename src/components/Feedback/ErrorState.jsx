export function ErrorState({ title = 'Что-то пошло не так', description = 'Попробуйте ещё раз.' }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-center">
      <div className="max-w-md space-y-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-rose-100/80">{description}</p>
      </div>
    </div>
  );
}
