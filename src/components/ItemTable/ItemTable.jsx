import { Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../UI/StatusBadge';
import { ItemImage } from '../UI/ItemImage';
import { formatCurrency } from '../../utils/formatters';
import { BOUGHT_STATUS, LISTED_STATUS, LOST_STATUS, SOLD_STATUS } from '../../utils/constants';

function getPublicationState(item) {
  if (!item.is_public) {
    return {
      label: 'Черновик',
      className: 'border-slate-700 bg-slate-950/70 text-slate-400',
      textClassName: 'text-slate-500',
    };
  }

  if ([BOUGHT_STATUS, LISTED_STATUS].includes(item.status)) {
    return {
      label: 'В магазине',
      className: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200',
      textClassName: 'text-emerald-300',
    };
  }

  return {
    label: 'Скрыт по статусу',
    className: 'border-amber-400/25 bg-amber-400/10 text-amber-200',
    textClassName: 'text-amber-300',
  };
}

function formatSalePrice(item) {
  const salePrice = item.actual_sale_price ?? item.planned_sale_price;
  return salePrice === null || salePrice === undefined ? '—' : formatCurrency(salePrice);
}

function ItemPreview({ item, size = 'table' }) {
  const imageClassName = size === 'card'
    ? 'h-16 w-16 min-[360px]:h-20 min-[360px]:w-20'
    : 'h-14 w-14';

  return (
    <ItemImage
      src={item.primary_photo}
      alt={item.title}
      className={`${imageClassName} flex-none rounded-2xl object-cover`}
    />
  );
}

function ItemMobileCard({ item, deletingItemId, onDelete, canManage }) {
  const publicationState = getPublicationState(item);
  const hasRealizedProfit = [SOLD_STATUS, LOST_STATUS].includes(item.status);

  return (
    <article className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/60 p-3 shadow-panel backdrop-blur-xl transition hover:border-slate-700/90 min-[360px]:p-4">
      <div className="flex min-w-0 gap-3">
        <ItemPreview item={item} size="card" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-white">{item.title}</p>
          <p className="mt-1 truncate text-xs text-slate-500">
            {[item.brand, item.category, item.size].filter(Boolean).join(' • ') || 'Без категории'}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={item.status} />
            {canManage ? (
              <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${publicationState.className}`}>
                {publicationState.label}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 grid min-w-0 grid-cols-1 gap-2 text-sm min-[360px]:grid-cols-2 min-[360px]:gap-3">
        <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-950/35 p-3">
          <p className="text-xs text-slate-500">Закупка</p>
          <p className="mt-1 break-words font-medium tabular-nums text-slate-100 [overflow-wrap:anywhere]">{formatCurrency(item.purchase_price)}</p>
        </div>
        <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-950/35 p-3">
          <p className="text-xs text-slate-500">Продажа</p>
          <p className="mt-1 break-words font-medium tabular-nums text-slate-100 [overflow-wrap:anywhere]">{formatSalePrice(item)}</p>
        </div>
        <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-950/35 p-3">
          <p className="text-xs text-slate-500">Расходы</p>
          <p className="mt-1 break-words font-medium tabular-nums text-slate-100 [overflow-wrap:anywhere]">{formatCurrency(item.total_expenses)}</p>
        </div>
        <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-950/35 p-3">
          <p className="text-xs text-slate-500">Прибыль</p>
          <p className={`mt-1 break-words font-semibold tabular-nums [overflow-wrap:anywhere] ${
            hasRealizedProfit
              ? item.profit >= 0 ? 'text-emerald-300' : 'text-rose-300'
              : 'text-slate-400'
          }`}>
            {hasRealizedProfit ? formatCurrency(item.profit) : '—'}
          </p>
        </div>
      </div>

      {canManage ? (
        <div className="mt-4 grid min-w-0 grid-cols-1 gap-2 min-[360px]:grid-cols-2">
          <Link
            to={`/items/${item.id}/edit`}
            className="button-secondary px-3 py-2 text-xs"
            aria-label={`Редактировать ${item.title}`}
          >
            Редактировать
          </Link>
          <button
            type="button"
            className="button-secondary border-rose-500/30 px-3 py-2 text-xs text-rose-300 hover:border-rose-400/40 hover:bg-rose-500/10"
            onClick={() => onDelete(item)}
            disabled={Boolean(deletingItemId)}
            aria-label={`Удалить ${item.title}`}
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
      <div className="grid w-full min-w-0 max-w-full grid-cols-1 gap-3 md:grid-cols-2 xl:hidden">
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
            {items.map((item) => {
              const publicationState = getPublicationState(item);

              return (
                <tr key={item.id} className="hover:bg-slate-800/40">
                  <td className="px-3 py-3">
                    <ItemPreview item={item} />
                  </td>
                  <td className="min-w-0 px-3 py-3">
                    <p className="truncate font-medium text-white">{item.title}</p>
                    <p className="truncate text-xs text-slate-500">
                      {[item.brand, item.category, item.size].filter(Boolean).join(' • ') || 'Без категории'}
                    </p>
                    {canManage ? (
                      <p className={`mt-1 text-xs font-medium ${publicationState.textClassName}`}>
                        {publicationState.label}
                      </p>
                    ) : null}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 tabular-nums text-slate-200">{formatCurrency(item.purchase_price)}</td>
                  <td className="whitespace-nowrap px-3 py-3 tabular-nums text-slate-200">{formatSalePrice(item)}</td>
                  <td className="whitespace-nowrap px-3 py-3 tabular-nums text-slate-200">{formatCurrency(item.total_expenses)}</td>
                  <td className={`whitespace-nowrap px-3 py-3 font-semibold tabular-nums ${
                    [SOLD_STATUS, LOST_STATUS].includes(item.status)
                      ? item.profit >= 0 ? 'text-emerald-300' : 'text-rose-300'
                      : 'text-slate-400'
                  }`}>
                    {[SOLD_STATUS, LOST_STATUS].includes(item.status) ? formatCurrency(item.profit) : '—'}
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
                          disabled={Boolean(deletingItemId)}
                          title="Удалить"
                          aria-label={`Удалить ${item.title}`}
                        >
                          <Trash2 className="h-5 w-5" strokeWidth={2.25} />
                        </button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
