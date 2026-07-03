import { calculateItemProfit } from './itemMetrics';

export function normalizeItem(item) {
  const total_expenses = (item.expenses ?? []).reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const normalizedItem = {
    ...item,
    total_expenses,
    primary_photo: item.item_photos?.[0]?.image_url ?? null,
  };

  return {
    ...normalizedItem,
    profit: calculateItemProfit(normalizedItem),
  };
}
