import { BarChart3, CalendarRange, DollarSign, Package2, PlusSquare, Wallet } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const links = [
  { to: '/dashboard', label: 'Дашборд', icon: BarChart3 },
  { to: '/items', label: 'Товары', icon: Package2 },
  { to: '/items/new', label: 'Добавить вещь', icon: PlusSquare },
  { to: '/expenses', label: 'Расходы', icon: Wallet },
  { to: '/sales', label: 'Продажи', icon: DollarSign },
  { to: '/monthly', label: 'Месяцы', icon: CalendarRange },
];

export function Sidebar() {
  return (
    <aside className="hidden w-72 flex-col border-r border-slate-800/80 bg-slate-950/80 px-5 py-6 shadow-panel backdrop-blur-xl lg:flex">
      <div className="mb-10">
        <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-700/70 bg-slate-900/70 px-4 py-3 shadow-panel">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/25 bg-sky-400/15 text-lg font-bold text-sky-300">
            S
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-sky-300">Учёт и аналитика</p>
            <h1 className="text-xl font-semibold text-white">SecondTrack</h1>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition',
                  isActive
                    ? 'border-sky-400/30 bg-sky-400/15 text-sky-100 shadow-glow'
                    : 'border-transparent text-slate-300 hover:border-slate-700/80 hover:bg-slate-900/70 hover:text-white',
                )
              }
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
