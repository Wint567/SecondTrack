import { useMemo } from 'react';
import { useItems } from './useItems';
import { useExpenses } from './useExpenses';
import { buildMonthlyStats, buildStatusChart } from '../utils/chartData';
import { calculateItemProfit, calculateRoi } from '../utils/itemMetrics';
import { SOLD_STATUS } from '../utils/constants';

export function useDashboardMetrics() {
  const itemsQuery = useItems();
  const expensesQuery = useExpenses();

  const metrics = useMemo(() => {
    const items = itemsQuery.data ?? [];
    const expenses = expensesQuery.data ?? [];
    const soldItems = items.filter((item) => item.status === SOLD_STATUS);

    const totalPurchaseAmount = items.reduce((sum, item) => sum + Number(item.purchase_price || 0), 0);
    const totalSales = soldItems.reduce((sum, item) => sum + Number(item.actual_sale_price || 0), 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
    const soldNetProfit = soldItems.reduce((sum, item) => sum + calculateItemProfit(item), 0);
    const totalLoss = soldItems.reduce((sum, item) => {
      const profit = calculateItemProfit(item);
      return profit < 0 ? sum + Math.abs(profit) : sum;
    }, 0);
    const cashflow = totalSales - totalPurchaseAmount - totalExpenses;
    const roi = calculateRoi(cashflow, totalPurchaseAmount + totalExpenses);
    const monthlyStats = buildMonthlyStats(items, expenses);

    return {
      totalPurchaseAmount,
      totalSales,
      totalExpenses,
      soldNetProfit,
      totalLoss,
      cashflow,
      roi,
      itemsCount: items.length,
      monthlyStats,
      statusChart: buildStatusChart(items),
      soldItems,
    };
  }, [expensesQuery.data, itemsQuery.data]);

  return {
    ...metrics,
    isLoading: itemsQuery.isLoading || expensesQuery.isLoading,
    isError: itemsQuery.isError || expensesQuery.isError,
    error: itemsQuery.error || expensesQuery.error,
  };
}
