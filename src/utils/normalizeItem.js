import { calculateItemProfit } from './itemMetrics';

export function normalizeItem(item) {
  const total_expenses = (item.expenses ?? []).reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const primaryPhoto = item.item_photos?.find((photo) => photo.id === item.primary_photo_id)
    ?? item.item_photos?.[0]
    ?? null;
  const normalizedItem = {
    ...item,
    total_expenses,
    primary_photo: primaryPhoto?.image_url ?? null,
  };

  return {
    ...normalizedItem,
    profit: calculateItemProfit(normalizedItem),
  };
}
