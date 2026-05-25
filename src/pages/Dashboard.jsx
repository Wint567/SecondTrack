import { Link } from 'react-router-dom';
import { ChartCard } from '../components/Charts/ChartCard';
import { LineTrendChart } from '../components/Charts/LineTrendChart';
import { StatusPieChart } from '../components/Charts/StatusPieChart';
import { ErrorState } from '../components/Feedback/ErrorState';
import { LoadingState } from '../components/Feedback/LoadingState';
import { PageHeader } from '../components/UI/PageHeader';
import { StatCard } from '../components/UI/StatCard';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { formatCurrency } from '../utils/formatters';

export function Dashboard() {
  const metrics = useDashboardMetrics();

  if (metrics.isLoading) {
    return <LoadingState label="Загрузка дашборда..." />;
  }

  if (metrics.isError) {
    return <ErrorState description={metrics.error?.message || 'Не удалось загрузить метрики дашборда.'} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Обзор"
        title="Ключевые показатели по товарам"
        description="Следите за затратами на закупку, выручкой от продаж, расходами и реальной прибылью по всем вещам."
        action={
          <Link to="/items/new" className="button-primary">
            Добавить вещь
          </Link>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard label="Сумма закупок" value={formatCurrency(metrics.totalPurchaseAmount)} />
        <StatCard label="Сумма продаж" value={formatCurrency(metrics.totalSales)} />
        <StatCard label="Сумма расходов" value={formatCurrency(metrics.totalExpenses)} />
        <StatCard label="Чистая прибыль" value={formatCurrency(metrics.netProfit)} tone={metrics.netProfit >= 0 ? 'positive' : 'negative'} />
        <StatCard label="Общий убыток" value={formatCurrency(metrics.totalLoss)} tone={metrics.totalLoss > 0 ? 'negative' : 'default'} />
        <StatCard label="ROI" value={`${metrics.roi.toFixed(1)}%`} subtext={`Всего товаров: ${metrics.itemsCount}`} tone={metrics.roi >= 0 ? 'positive' : 'negative'} />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Закупки по времени">
          <LineTrendChart data={metrics.purchaseTrend} stroke="#38bdf8" />
        </ChartCard>
        <ChartCard title="Продажи по времени">
          <LineTrendChart data={metrics.salesTrend} stroke="#34d399" />
        </ChartCard>
        <ChartCard title="Прибыль по времени">
          <LineTrendChart data={metrics.profitTrend} stroke="#f59e0b" />
        </ChartCard>
        <ChartCard title="Товары по статусам">
          <StatusPieChart data={metrics.statusChart} />
        </ChartCard>
      </section>
    </div>
  );
}
