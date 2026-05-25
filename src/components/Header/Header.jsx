export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Личный кабинет учёта</p>
            <h2 className="text-xl font-semibold text-white">Аналитика перепродажи одежды</h2>
          </div>
        </div>
        <div className="hidden rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2 text-right sm:block">
          <p className="text-xs text-slate-500">Режим приложения</p>
          <p className="text-sm font-medium text-slate-200">Один пользователь</p>
        </div>
      </div>
    </header>
  );
}
