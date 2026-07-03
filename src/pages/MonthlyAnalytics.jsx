import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EmptyState } from '../components/Feedback/EmptyState';
import { ErrorState } from '../components/Feedback/ErrorState';
import { LoadingState } from '../components/Feedback/LoadingState';
import { PageHeader } from '../components/UI/PageHeader';
import { StatCard } from '../components/UI/StatCard';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { formatCurrency, formatDate } from '../utils/formatters';

function ItemPhoto({ item }) {
  if (item.primary_photo) {
    return (
      <img
        src={item.primary_photo}
        alt={item.title}
        className="h-16 w-16 flex-none rounded-2xl object-cover"
      />
    );
  }

  return (
    <div className="flex h-16 w-16 flex-none items-center justify-center rounded-2xl border border-dashed border-slate-700 text-xs text-slate-500">
      Нет фото
    </div>
  );
}

function PurchasedItemCard({ item }) {
  return (
    <article className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-4 shadow-panel backdrop-blur-xl transition hover:border-slate-700/90">
      <div className="flex gap-3">
        <ItemPhoto item={item} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-white">{item.title}</p>
          <p className="mt-1 text-xs text-slate-500">
            {[item.brand, item.category, item.size].filter(Boolean).join(' • ') || 'Без категории'}
          </p>
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/35 p-3">
              <p className="text-xs text-slate-500">Закупка</p>
              <p className="mt-1 font-medium tabular-nums text-slate-100">{formatCurrency(item.purchase_price)}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/35 p-3">
              <p className="text-xs text-slate-500">Дата</p>
              <p className="mt-1 font-medium text-slate-100">{formatDate(item.purchase_date)}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function SoldItemCard({ item }) {
  const profitTone = item.profit >= 0 ? 'text-emerald-400' : 'text-rose-400';

  return (
    <article className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-4 shadow-panel backdrop-blur-xl transition hover:border-slate-700/90">
      <div className="flex gap-3">
        <ItemPhoto item={item} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="truncate font-medium text-white">{item.title}</p>
              <p className="mt-1 text-xs text-slate-500">
                {[item.brand, item.category, item.size].filter(Boolean).join(' • ') || 'Без категории'}
              </p>
            </div>
            <p className={`whitespace-nowrap rounded-xl border border-slate-800 bg-slate-950/45 px-3 py-1.5 text-lg font-semibold tabular-nums ${profitTone}`}>
              {formatCurrency(item.profit)}
            </p>
          </div>

          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2 xl:grid-cols-4">
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
            <div className="rounded-xl border border-slate-800 bg-slate-950/35 p-3">
              <p className="text-xs text-slate-500">Дата</p>
              <p className="mt-1 font-medium text-slate-100">{formatDate(item.sold_at)}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function MonthlyAnalytics() {
  const metrics = useDashboardMetrics();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (metrics.monthlyStats?.length) {
      setSelectedIndex(metrics.monthlyStats.length - 1);
    }
  }, [metrics.monthlyStats?.length]);

  if (metrics.isLoading) {
    return <LoadingState label="Загрузка месяцев..." />;
  }

  if (metrics.isError) {
    return <ErrorState description={metrics.error?.message || 'Не удалось загрузить месячную аналитику.'} />;
  }

  if (!metrics.monthlyStats.length) {
    return (
      <EmptyState
        title="Месячной аналитики пока нет"
        description="Добавьте первую вещь, чтобы увидеть покупки, продажи и прибыль по месяцам."
      />
    );
  }

  const selectedMonth = metrics.monthlyStats[selectedIndex];
  const canGoBack = selectedIndex > 0;
  const canGoForward = selectedIndex < metrics.monthlyStats.length - 1;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Месяцы"
        title="Ежемесячная аналитика"
        description="Листайте месяцы и смотрите, сколько потрачено, сколько заработано, есть ли потеря и какой итог за месяц."
      />

      <section className="card space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            className="button-secondary w-full gap-2 sm:w-auto"
            onClick={() => setSelectedIndex((current) => Math.max(current - 1, 0))}
            disabled={!canGoBack}
          >
            <ChevronLeft className="h-4 w-4" />
            Предыдущий
          </button>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/35 px-5 py-3 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-sky-300">Выбранный месяц</p>
            <h2 className="mt-1 text-2xl font-semibold capitalize text-white">{selectedMonth.date}</h2>
          </div>

          <button
            type="button"
            className="button-secondary w-full gap-2 sm:w-auto"
            onClick={() => setSelectedIndex((current) => Math.min(current + 1, metrics.monthlyStats.length - 1))}
            disabled={!canGoForward}
          >
            Следующий
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          label="Потрачено"
          value={formatCurrency(selectedMonth.spentAmount)}
          subtext={`Закупки ${formatCurrency(selectedMonth.purchaseAmount)} + расходы ${formatCurrency(selectedMonth.expenseAmount)}`}
          tone={selectedMonth.spentAmount > 0 ? 'negative' : 'default'}
        />
        <StatCard
          label="Заработано"
          value={formatCurrency(selectedMonth.earnedAmount)}
          subtext="Продажи за выбранный месяц"
          tone={selectedMonth.earnedAmount > 0 ? 'positive' : 'default'}
        />
        <StatCard
          label="Потерял"
          value={formatCurrency(selectedMonth.lostAmount)}
          subtext="Если потрачено больше, чем заработано"
          tone={selectedMonth.lostAmount > 0 ? 'negative' : 'default'}
        />
        <StatCard
          label="Cashflow месяца"
          value={formatCurrency(selectedMonth.cashflow)}
          subtext="Заработано - потрачено"
          tone={selectedMonth.cashflow >= 0 ? 'positive' : 'negative'}
        />
        <StatCard
          label="Прибыль продаж"
          value={formatCurrency(selectedMonth.soldProfit)}
          subtext="Продажа - закупка - расходы"
          tone={selectedMonth.soldProfit >= 0 ? 'positive' : 'negative'}
        />
        <StatCard label="Продано товаров" value={selectedMonth.soldItemsCount} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Куплено в этом месяце</h3>
            <p className="text-sm text-slate-400">Товары попадают сюда по дате покупки.</p>
          </div>

          {selectedMonth.purchasedItems.length ? (
            <div className="space-y-3">
              {selectedMonth.purchasedItems.map((item) => (
                <PurchasedItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState title="Покупок не было" description="В этом месяце нет товаров с датой покупки." />
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Продано в этом месяце</h3>
            <p className="text-sm text-slate-400">Чистая прибыль по товару: продажа - закупка - расходы.</p>
          </div>

          {selectedMonth.soldItems.length ? (
            <div className="space-y-3">
              {selectedMonth.soldItems.map((item) => (
                <SoldItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState title="Продаж не было" description="В этом месяце нет товаров с датой продажи." />
          )}
        </div>
      </section>
    </div>
  );
}
