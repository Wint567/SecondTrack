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
import { useAuth } from '../auth/useAuth';

export function Dashboard() {
  const metrics = useDashboardMetrics();
  const { isAuthenticated } = useAuth();

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
        action={isAuthenticated ? (
          <Link to="/items/new" className="button-primary w-full sm:w-auto">
            Добавить вещь
          </Link>
        ) : null}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard label="Покупки всего" value={formatCurrency(metrics.totalPurchaseAmount)} />
        <StatCard label="Продажи по товарам" value={formatCurrency(metrics.totalSales)} />
        <StatCard label="Расходы всего" value={formatCurrency(metrics.totalExpenses)} />
        <StatCard
          label="Cashflow"
          value={formatCurrency(metrics.cashflow)}
          subtext="Продажи - покупки - расходы"
          tone={metrics.cashflow >= 0 ? 'positive' : 'negative'}
        />
        <StatCard
          label="Прибыль по продажам"
          value={formatCurrency(metrics.soldNetProfit)}
          subtext="Только проданные товары"
          tone={metrics.soldNetProfit >= 0 ? 'positive' : 'negative'}
        />
        <StatCard label="ROI cashflow" value={`${metrics.roi.toFixed(1)}%`} subtext={`Всего товаров: ${metrics.itemsCount}`} tone={metrics.roi >= 0 ? 'positive' : 'negative'} />
      </section>

      <section className="grid gap-5">
        <ChartCard title="Закупки по месяцам">
          <LineTrendChart data={metrics.monthlyStats} dataKey="purchaseAmount" stroke="#c9a94f" />
        </ChartCard>
        <ChartCard title="Ежемесячный доход">
          <LineTrendChart data={metrics.monthlyStats} dataKey="salesAmount" stroke="#34d97a" />
        </ChartCard>
        <ChartCard title="Cashflow по месяцам">
          <LineTrendChart data={metrics.monthlyStats} dataKey="cashflow" stroke="#18b862" />
        </ChartCard>
        <ChartCard title="Прибыль по проданным товарам">
          <LineTrendChart data={metrics.monthlyStats} dataKey="soldProfit" stroke="#34d97a" />
        </ChartCard>
        <ChartCard title="Товары по месяцам">
          <LineTrendChart
            data={metrics.monthlyStats}
            valueType="number"
            yAxisWidth={48}
            lines={[
              { dataKey: 'itemsCount', name: 'Товаров', stroke: '#c9a94f' },
              { dataKey: 'soldItemsCount', name: 'Продано', stroke: '#34d97a' },
            ]}
          />
        </ChartCard>
        <ChartCard title="Товары по статусам">
          <StatusPieChart data={metrics.statusChart} />
        </ChartCard>
      </section>
    </div>
  );
}
