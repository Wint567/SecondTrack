import { EmptyState } from '../components/Feedback/EmptyState';
import { ErrorState } from '../components/Feedback/ErrorState';
import { LoadingState } from '../components/Feedback/LoadingState';
import { PageHeader } from '../components/UI/PageHeader';
import { DataTableShell } from '../components/UI/DataTableShell';
import { StatCard } from '../components/UI/StatCard';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { formatCurrency, formatDate } from '../utils/formatters';
import { calculateItemProfit } from '../utils/itemMetrics';

function SoldItemCard({ item }) {
  const profit = calculateItemProfit(item);
  const profitTone = profit >= 0 ? 'text-emerald-400' : 'text-rose-400';

  return (
    <article className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-4 shadow-panel backdrop-blur-xl transition hover:border-slate-700/90">
      <div className="space-y-1">
        <p className="truncate font-medium text-white">{item.title}</p>
        <p className="text-xs text-slate-500">{item.brand || 'Без бренда'}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border border-slate-800 bg-slate-950/35 p-3">
          <p className="text-xs text-slate-500">Дата продажи</p>
          <p className="mt-1 font-medium text-slate-100">{formatDate(item.sold_at)}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/35 p-3">
          <p className="text-xs text-slate-500">Продажа</p>
          <p className="mt-1 font-medium tabular-nums text-slate-100">{formatCurrency(item.actual_sale_price)}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/35 p-3">
          <p className="text-xs text-slate-500">Закупка</p>
          <p className="mt-1 font-medium tabular-nums text-slate-100">{formatCurrency(item.purchase_price)}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/35 p-3">
          <p className="text-xs text-slate-500">Расходы</p>
          <p className="mt-1 font-medium tabular-nums text-slate-100">{formatCurrency(item.total_expenses)}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/50 px-3 py-2.5">
        <p className="text-xs text-slate-500">Прибыль по товару</p>
        <p className={`mt-1 text-lg font-semibold tabular-nums ${profitTone}`}>{formatCurrency(profit)}</p>
      </div>
    </article>
  );
}

export function Sales() {
  const metrics = useDashboardMetrics();

  if (metrics.isLoading) {
    return <LoadingState label="Загрузка продаж..." />;
  }

  if (metrics.isError) {
    return <ErrorState description={metrics.error?.message || 'Не удалось загрузить продажи.'} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Продажи"
        title="Проданные товары и итоговая прибыль"
        description="Просматривайте завершённые продажи, сравнивайте себестоимость с ценой продажи и отслеживайте итог по каждой вещи."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard label="Проданных товаров" value={metrics.soldItems.length} />
        <StatCard
          label="Итог по продажам"
          value={formatCurrency(metrics.soldNetProfit)}
          tone={metrics.soldNetProfit >= 0 ? 'positive' : 'negative'}
        />
        <StatCard label="Убыток продаж" value={formatCurrency(metrics.totalLoss)} tone={metrics.totalLoss > 0 ? 'negative' : 'default'} />
      </div>

      <DataTableShell title="Проданные товары" description="Фактические продажи и итог после всех расходов по каждой вещи.">
        {metrics.soldItems.length ? (
          <>
            <div className="grid gap-3 md:hidden">
              {metrics.soldItems.map((item) => (
                <SoldItemCard key={item.id} item={item} />
              ))}
            </div>

            <div className="hidden max-w-full overflow-x-auto rounded-2xl border border-slate-800/90 bg-slate-900/60 shadow-panel backdrop-blur-xl md:block">
              <table className="w-full min-w-[760px] divide-y divide-slate-800">
                <thead className="bg-slate-950/60 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                  <tr>
                    <th className="min-w-[220px] px-4 py-3 sm:px-5 sm:py-4">Товар</th>
                    <th className="whitespace-nowrap px-4 py-3 sm:px-5 sm:py-4">Дата продажи</th>
                    <th className="whitespace-nowrap px-4 py-3 sm:px-5 sm:py-4">Закупка</th>
                    <th className="whitespace-nowrap px-4 py-3 sm:px-5 sm:py-4">Расходы</th>
                    <th className="whitespace-nowrap px-4 py-3 sm:px-5 sm:py-4">Продажа</th>
                    <th className="whitespace-nowrap px-4 py-3 sm:px-5 sm:py-4">Прибыль</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {metrics.soldItems.map((item) => {
                    const profit = calculateItemProfit(item);

                    return (
                      <tr key={item.id} className="hover:bg-slate-800/40">
                        <td className="px-4 py-3 sm:px-5 sm:py-4">
                          <p className="font-medium text-white">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.brand || 'Без бренда'}</p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-400 sm:px-5 sm:py-4">{formatDate(item.sold_at)}</td>
                        <td className="whitespace-nowrap px-4 py-3 tabular-nums text-slate-200 sm:px-5 sm:py-4">{formatCurrency(item.purchase_price)}</td>
                        <td className="whitespace-nowrap px-4 py-3 tabular-nums text-slate-200 sm:px-5 sm:py-4">{formatCurrency(item.total_expenses)}</td>
                        <td className="whitespace-nowrap px-4 py-3 tabular-nums text-slate-200 sm:px-5 sm:py-4">{formatCurrency(item.actual_sale_price)}</td>
                        <td className={`whitespace-nowrap px-4 py-3 font-semibold tabular-nums sm:px-5 sm:py-4 ${profit >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                          {formatCurrency(profit)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <EmptyState title="Продаж пока нет" description="Отметьте вещь как проданную и укажите цену продажи, чтобы увидеть итоговую прибыль." />
        )}
      </DataTableShell>
    </div>
  );
}
