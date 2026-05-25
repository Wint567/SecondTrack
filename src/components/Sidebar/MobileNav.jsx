import { BarChart3, DollarSign, Package2, PlusSquare, Wallet } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const links = [
  { to: '/dashboard', label: 'Дашборд', icon: BarChart3 },
  { to: '/items', label: 'Товары', icon: Package2 },
  { to: '/items/new', label: 'Добавить', icon: PlusSquare },
  { to: '/expenses', label: 'Расходы', icon: Wallet },
  { to: '/sales', label: 'Продажи', icon: DollarSign },
];

export function MobileNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 gap-2 rounded-3xl border border-slate-800 bg-slate-950/90 p-2 shadow-2xl backdrop-blur lg:hidden">
      {links.map((link) => {
        const Icon = link.icon;

        return (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition',
                isActive ? 'bg-sky-400 text-slate-950' : 'text-slate-400 hover:bg-slate-900 hover:text-white',
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span>{link.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
