export function calculateItemProfit(item) {
  const sale = Number(item.actual_sale_price) || 0;
  const purchase = Number(item.purchase_price) || 0;
  const expenses = Number(item.total_expenses) || 0;

  return sale - purchase - expenses;
}

export function calculateRoi(profit, spend) {
  if (!spend) {
    return 0;
  }

  return (profit / spend) * 100;
}
