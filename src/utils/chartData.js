import { addMonths, format, startOfMonth } from 'date-fns';
import { ru } from 'date-fns/locale';
import { calculateItemProfit } from './itemMetrics';
import { SOLD_STATUS } from './constants';

function parseDate(value) {
  if (!value) {
    return null;
  }

  const normalizedValue =
    typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? `${value}T00:00:00`
      : value;
  const date = new Date(normalizedValue);

  return Number.isNaN(date.getTime()) ? null : date;
}

function getMonthKey(date) {
  return format(date, 'yyyy-MM');
}

function createMonthlyStat(monthDate) {
  return {
    month: getMonthKey(monthDate),
    date: format(monthDate, 'LLL yyyy', { locale: ru }),
    purchaseAmount: 0,
    expenseAmount: 0,
    spentAmount: 0,
    salesAmount: 0,
    earnedAmount: 0,
    lostAmount: 0,
    cashflow: 0,
    soldProfit: 0,
    itemsCount: 0,
    soldItemsCount: 0,
    purchasedItems: [],
    soldItems: [],
  };
}

function getActivityDates(items, expenses = []) {
  return [
    ...items.flatMap((item) => [parseDate(item.purchase_date), parseDate(item.sold_at)]),
    ...expenses.map((expense) => parseDate(expense.expense_date)),
  ].filter(Boolean);
}

export function buildMonthlyStats(items, expenses = []) {
  const activityDates = getActivityDates(items, expenses);

  if (!activityDates.length) {
    return [];
  }

  const firstActivityMonth = startOfMonth(
    activityDates.reduce((earliestDate, date) => {
      return date < earliestDate ? date : earliestDate;
    }, activityDates[0]),
  );
  const lastActivityMonth = startOfMonth(
    activityDates.reduce((latestDate, date) => {
      return date > latestDate ? date : latestDate;
    }, activityDates[0]),
  );
  const monthlyStats = [];
  const statsByMonth = {};

  for (
    let monthDate = firstActivityMonth;
    monthDate <= lastActivityMonth;
    monthDate = addMonths(monthDate, 1)
  ) {
    const stat = createMonthlyStat(monthDate);
    monthlyStats.push(stat);
    statsByMonth[stat.month] = stat;
  }

  items.forEach((item) => {
    const purchaseDate = parseDate(item.purchase_date);

    if (purchaseDate) {
      const purchaseMonth = statsByMonth[getMonthKey(startOfMonth(purchaseDate))];

      if (purchaseMonth) {
        const purchaseAmount = Number(item.purchase_price) || 0;
        purchaseMonth.purchaseAmount += purchaseAmount;
        purchaseMonth.spentAmount += purchaseAmount;
        purchaseMonth.itemsCount += 1;
        purchaseMonth.purchasedItems.push(item);
      }
    }

    const saleDate = parseDate(item.sold_at);

    if (item.status === SOLD_STATUS && saleDate) {
      const saleMonth = statsByMonth[getMonthKey(startOfMonth(saleDate))];

      if (saleMonth) {
        const saleAmount = Number(item.actual_sale_price) || 0;
        const profit = calculateItemProfit(item);
        saleMonth.salesAmount += saleAmount;
        saleMonth.earnedAmount += saleAmount;
        saleMonth.soldProfit += profit;
        saleMonth.soldItemsCount += 1;
        saleMonth.soldItems.push({
          ...item,
          profit,
        });
      }
    }
  });

  expenses.forEach((expense) => {
    const expenseDate = parseDate(expense.expense_date);

    if (!expenseDate) {
      return;
    }

    const expenseMonth = statsByMonth[getMonthKey(startOfMonth(expenseDate))];

    if (expenseMonth) {
      const expenseAmount = Number(expense.amount) || 0;
      expenseMonth.expenseAmount += expenseAmount;
      expenseMonth.spentAmount += expenseAmount;
    }
  });

  monthlyStats.forEach((month) => {
    month.cashflow = month.earnedAmount - month.spentAmount;
    month.lostAmount = month.cashflow < 0 ? Math.abs(month.cashflow) : 0;
  });

  return monthlyStats;
}

export function buildStatusChart(items) {
  const grouped = items.reduce((accumulator, item) => {
    const key = item.status || 'Неизвестно';
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
}
