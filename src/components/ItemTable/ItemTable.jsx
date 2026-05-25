import { Link } from 'react-router-dom';
import { formatCurrency, formatStatusLabel } from '../../utils/formatters';

export function ItemTable({ items, deletingItemId = null, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800">
          <thead className="bg-slate-950/60 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
            <tr>
              <th className="px-5 py-4">Фото</th>
              <th className="px-5 py-4">Название</th>
              <th className="px-5 py-4">Цена покупки</th>
              <th className="px-5 py-4">Цена продажи</th>
              <th className="px-5 py-4">Расходы</th>
              <th className="px-5 py-4">Прибыль</th>
              <th className="px-5 py-4">Статус</th>
              <th className="px-5 py-4">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/40">
                <td className="px-5 py-4">
                  {item.primary_photo ? (
                    <img
                      src={item.primary_photo}
                      alt={item.title}
                      className="h-14 w-14 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-slate-700 text-xs text-slate-500">
                      Нет фото
                    </div>
                  )}
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="text-xs text-slate-500">
                    {[item.brand, item.category, item.size].filter(Boolean).join(' • ') || 'Без категории'}
                  </p>
                </td>
                <td className="px-5 py-4 text-slate-200">{formatCurrency(item.purchase_price)}</td>
                <td className="px-5 py-4 text-slate-200">{formatCurrency(item.actual_sale_price || item.planned_sale_price)}</td>
                <td className="px-5 py-4 text-slate-200">{formatCurrency(item.total_expenses)}</td>
                <td className={`px-5 py-4 font-medium ${item.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatCurrency(item.profit)}
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300">
                    {formatStatusLabel(item.status)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Link to={`/items/${item.id}/edit`} className="button-secondary">
                      Редактировать
                    </Link>
                    <button
                      type="button"
                      className="button-secondary border-rose-500/30 text-rose-300 hover:border-rose-400/40 hover:bg-rose-500/10"
                      onClick={() => onDelete(item)}
                      disabled={deletingItemId === item.id}
                    >
                      {deletingItemId === item.id ? 'Удаление...' : 'Удалить'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
