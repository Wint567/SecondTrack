import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { calculateItemProfit } from './itemMetrics';
import { SOLD_STATUS } from './constants';

function aggregateByDate(rows, key, mapper) {
  const grouped = rows.reduce((accumulator, row) => {
    const rawDate = row[key];

    if (!rawDate) {
      return accumulator;
    }

    const label = format(new Date(rawDate), 'd MMM', { locale: ru });
    accumulator[label] = (accumulator[label] || 0) + mapper(row);
    return accumulator;
  }, {});

  return Object.entries(grouped).map(([date, value]) => ({ date, value }));
}

export function buildPurchaseTrend(items) {
  return aggregateByDate(items, 'purchase_date', (item) => Number(item.purchase_price) || 0);
}

export function buildSalesTrend(items) {
  return aggregateByDate(items.filter((item) => item.status === SOLD_STATUS), 'sold_at', (item) => Number(item.actual_sale_price) || 0);
}

export function buildProfitTrend(items) {
  return aggregateByDate(items.filter((item) => item.status === SOLD_STATUS), 'sold_at', calculateItemProfit);
}

export function buildStatusChart(items) {
  const grouped = items.reduce((accumulator, item) => {
    const key = item.status || 'Неизвестно';
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
}
