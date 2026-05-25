import { EmptyState } from '../components/Feedback/EmptyState';
import { ErrorState } from '../components/Feedback/ErrorState';
import { LoadingState } from '../components/Feedback/LoadingState';
import { PageHeader } from '../components/UI/PageHeader';
import { DataTableShell } from '../components/UI/DataTableShell';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { formatCurrency, formatDate } from '../utils/formatters';
import { calculateItemProfit } from '../utils/itemMetrics';

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
        <div className="card">
          <p className="text-sm text-slate-400">Проданных товаров</p>
          <p className="mt-3 text-3xl font-semibold text-white">{metrics.soldItems.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-400">Общая прибыль</p>
          <p className="mt-3 text-3xl font-semibold text-emerald-400">{formatCurrency(metrics.totalProfit)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-400">Общий убыток</p>
          <p className="mt-3 text-3xl font-semibold text-rose-400">{formatCurrency(metrics.totalLoss)}</p>
        </div>
      </div>

      <DataTableShell title="Проданные товары" description="Фактические продажи и итог после всех расходов по каждой вещи.">
        {metrics.soldItems.length ? (
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800">
                <thead className="bg-slate-950/60 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Товар</th>
                    <th className="px-5 py-4">Дата продажи</th>
                    <th className="px-5 py-4">Закупка</th>
                    <th className="px-5 py-4">Расходы</th>
                    <th className="px-5 py-4">Продажа</th>
                    <th className="px-5 py-4">Прибыль</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {metrics.soldItems.map((item) => {
                    const profit = calculateItemProfit(item);

                    return (
                      <tr key={item.id} className="hover:bg-slate-800/40">
                        <td className="px-5 py-4">
                          <p className="font-medium text-white">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.brand || 'Без бренда'}</p>
                        </td>
                        <td className="px-5 py-4 text-slate-400">{formatDate(item.sold_at)}</td>
                        <td className="px-5 py-4 text-slate-200">{formatCurrency(item.purchase_price)}</td>
                        <td className="px-5 py-4 text-slate-200">{formatCurrency(item.total_expenses)}</td>
                        <td className="px-5 py-4 text-slate-200">{formatCurrency(item.actual_sale_price)}</td>
                        <td className={`px-5 py-4 font-medium ${profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {formatCurrency(profit)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState title="Продаж пока нет" description="Отметьте вещь как проданную и укажите цену продажи, чтобы увидеть итоговую прибыль." />
        )}
      </DataTableShell>
    </div>
  );
}
