import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

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

export function formatCurrency(value) {
  const number = Number(value) || 0;
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: 2,
  }).format(number);
}

export function formatDate(value, fallback = 'Нет данных') {
  const date = parseDate(value);

  if (!date) {
    return fallback;
  }

  try {
    return format(date, 'd MMM yyyy', { locale: ru });
  } catch {
    return fallback;
  }
}

export function getDateInputValue(value = new Date()) {
  const date = parseDate(value);
  return date ? format(date, 'yyyy-MM-dd') : '';
}

export function formatStatusLabel(status) {
  return status || 'Неизвестно';
}
