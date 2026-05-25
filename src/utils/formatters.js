import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function formatCurrency(value) {
  const number = Number(value) || 0;
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: 2,
  }).format(number);
}

export function formatDate(value, fallback = 'Нет данных') {
  if (!value) {
    return fallback;
  }

  try {
    return format(new Date(value), 'd MMM yyyy', { locale: ru });
  } catch {
    return fallback;
  }
}

export function formatStatusLabel(status) {
  return status || 'Неизвестно';
}
