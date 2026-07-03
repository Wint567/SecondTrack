import { BarChart3, CalendarRange, DollarSign, Package2, PlusSquare, Wallet } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const links = [
  { to: '/dashboard', label: 'Дашборд', icon: BarChart3 },
  { to: '/items', label: 'Товары', icon: Package2 },
  { to: '/items/new', label: 'Добавить', icon: PlusSquare },
  { to: '/expenses', label: 'Расходы', icon: Wallet },
  { to: '/sales', label: 'Продажи', icon: DollarSign },
  { to: '/monthly', label: 'Месяцы', icon: CalendarRange },
];

export function MobileNav() {
  return (
    <nav className="fixed inset-x-2 bottom-3 z-30 grid grid-cols-6 gap-1 rounded-2xl border border-slate-800/90 bg-slate-950/90 p-1.5 shadow-panel backdrop-blur-xl lg:hidden">
      {links.map((link) => {
        const Icon = link.icon;

        return (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              clsx(
                'flex min-w-0 flex-col items-center gap-0.5 rounded-xl border px-1 py-2 text-[10px] font-medium transition',
                isActive
                  ? 'border-sky-400/30 bg-sky-400/15 text-sky-100'
                  : 'border-transparent text-slate-400 hover:bg-slate-900/70 hover:text-white',
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span className="max-w-full truncate">{link.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
