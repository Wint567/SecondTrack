import { Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../UI/StatusBadge';
import { formatCurrency } from '../../utils/formatters';

function ItemPreview({ item, size = 'table' }) {
  const imageClassName = size === 'card' ? 'h-20 w-20' : 'h-14 w-14';

  if (item.primary_photo) {
    return (
      <img
        src={item.primary_photo}
        alt={item.title}
        className={`${imageClassName} flex-none rounded-2xl object-cover`}
      />
    );
  }

  return (
    <div className={`flex ${imageClassName} flex-none items-center justify-center rounded-2xl border border-dashed border-slate-700 text-xs text-slate-500`}>
      Нет фото
    </div>
  );
}

function ItemMobileCard({ item, deletingItemId, onDelete, canManage }) {
  return (
    <article className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-4 shadow-panel backdrop-blur-xl transition hover:border-slate-700/90">
      <div className="flex gap-3">
        <ItemPreview item={item} size="card" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-white">{item.title}</p>
          <p className="mt-1 text-xs text-slate-500">
            {[item.brand, item.category, item.size].filter(Boolean).join(' • ') || 'Без категории'}
          </p>
          <div className="mt-3">
            <StatusBadge status={item.status} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border border-slate-800 bg-slate-950/35 p-3">
          <p className="text-xs text-slate-500">Закупка</p>
          <p className="mt-1 font-medium tabular-nums text-slate-100">{formatCurrency(item.purchase_price)}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/35 p-3">
          <p className="text-xs text-slate-500">Продажа</p>
          <p className="mt-1 font-medium tabular-nums text-slate-100">{formatCurrency(item.actual_sale_price || item.planned_sale_price)}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/35 p-3">
          <p className="text-xs text-slate-500">Расходы</p>
          <p className="mt-1 font-medium tabular-nums text-slate-100">{formatCurrency(item.total_expenses)}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/35 p-3">
          <p className="text-xs text-slate-500">Прибыль</p>
          <p className={`mt-1 font-semibold tabular-nums ${item.profit >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
            {formatCurrency(item.profit)}
          </p>
        </div>
      </div>

      {canManage ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link to={`/items/${item.id}/edit`} className="button-secondary px-3 py-2 text-xs">
            Редактировать
          </Link>
          <button
            type="button"
            className="button-secondary border-rose-500/30 px-3 py-2 text-xs text-rose-300 hover:border-rose-400/40 hover:bg-rose-500/10"
            onClick={() => onDelete(item)}
            disabled={deletingItemId === item.id}
          >
            {deletingItemId === item.id ? 'Удаление...' : 'Удалить'}
          </button>
        </div>
      ) : null}
    </article>
  );
}

export function ItemTable({ items, deletingItemId = null, onDelete, canManage = false }) {
  return (
    <>
      <div className="grid gap-3 md:grid-cols-2 xl:hidden">
        {items.map((item) => (
          <ItemMobileCard
            key={item.id}
            item={item}
            deletingItemId={deletingItemId}
            onDelete={onDelete}
            canManage={canManage}
          />
        ))}
      </div>

      <div className="hidden w-full max-w-full overflow-x-auto overscroll-x-contain rounded-2xl border border-slate-800/90 bg-slate-900/60 shadow-panel backdrop-blur-xl xl:block">
        <table className={`w-full table-fixed divide-y divide-slate-800 ${canManage ? 'min-w-[940px]' : 'min-w-[840px]'}`}>
          <colgroup>
            <col className="w-[76px]" />
            <col className="w-[240px]" />
            <col className="w-[106px]" />
            <col className="w-[106px]" />
            <col className="w-[100px]" />
            <col className="w-[106px]" />
            <col className="w-[114px]" />
            {canManage ? <col className="w-[92px]" /> : null}
          </colgroup>
          <thead className="bg-slate-950/60 text-left text-[11px] uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="whitespace-nowrap px-3 py-3">Фото</th>
              <th className="px-3 py-3">Название</th>
              <th className="whitespace-nowrap px-3 py-3">Покупка</th>
              <th className="whitespace-nowrap px-3 py-3">Продажа</th>
              <th className="whitespace-nowrap px-3 py-3">Расходы</th>
              <th className="whitespace-nowrap px-3 py-3">Прибыль</th>
              <th className="whitespace-nowrap px-3 py-3">Статус</th>
              {canManage ? <th className="whitespace-nowrap px-3 py-3 text-center">Действия</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/40">
                <td className="px-3 py-3">
                  <ItemPreview item={item} />
                </td>
                <td className="min-w-0 px-3 py-3">
                  <p className="truncate font-medium text-white">{item.title}</p>
                  <p className="truncate text-xs text-slate-500">
                    {[item.brand, item.category, item.size].filter(Boolean).join(' • ') || 'Без категории'}
                  </p>
                </td>
                <td className="whitespace-nowrap px-3 py-3 tabular-nums text-slate-200">{formatCurrency(item.purchase_price)}</td>
                <td className="whitespace-nowrap px-3 py-3 tabular-nums text-slate-200">{formatCurrency(item.actual_sale_price || item.planned_sale_price)}</td>
                <td className="whitespace-nowrap px-3 py-3 tabular-nums text-slate-200">{formatCurrency(item.total_expenses)}</td>
                <td className={`whitespace-nowrap px-3 py-3 font-semibold tabular-nums ${item.profit >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {formatCurrency(item.profit)}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <StatusBadge status={item.status} />
                </td>
                {canManage ? (
                  <td className="px-3 py-3">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/items/${item.id}/edit`}
                        className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-sky-300 transition hover:border-sky-400 hover:bg-slate-800"
                        title="Редактировать"
                        aria-label={`Редактировать ${item.title}`}
                      >
                        <Pencil className="h-5 w-5" strokeWidth={2.25} />
                      </Link>
                      <button
                        type="button"
                        className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-rose-500/30 bg-slate-900 text-rose-300 transition hover:border-rose-400/40 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => onDelete(item)}
                        disabled={deletingItemId === item.id}
                        title="Удалить"
                        aria-label={`Удалить ${item.title}`}
                      >
                        <Trash2 className="h-5 w-5" strokeWidth={2.25} />
                      </button>
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
