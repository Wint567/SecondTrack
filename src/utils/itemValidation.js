import { LISTED_STATUS, SOLD_STATUS } from './constants.js';

function isPositiveNumber(value) {
  const number = Number(value);
  return value !== '' && value !== null && value !== undefined && Number.isFinite(number) && number > 0;
}

export function getItemValidationError(item, photoCount = 0) {
  if (!item.title?.trim()) {
    return 'Введите название вещи.';
  }

  if (
    item.purchase_price === ''
    || item.purchase_price === null
    || item.purchase_price === undefined
    || !Number.isFinite(Number(item.purchase_price))
    || Number(item.purchase_price) < 0
  ) {
    return 'Укажите корректную цену покупки.';
  }

  if (item.status === SOLD_STATUS) {
    if (!isPositiveNumber(item.actual_sale_price)) {
      return 'Для проданного товара укажите фактическую цену продажи.';
    }

    if (!item.sold_at) {
      return 'Для проданного товара укажите дату продажи.';
    }
  }

  if (item.vinted_url?.trim() && !item.vinted_url.trim().startsWith('https://')) {
    return 'Ссылка на Vinted должна начинаться с https://.';
  }

  if (!item.is_public) {
    return '';
  }

  if (!item.brand?.trim()) {
    return 'Для публикации укажите бренд.';
  }

  if (!item.category?.trim()) {
    return 'Для публикации выберите категорию.';
  }

  if (!item.size?.trim()) {
    return 'Для публикации укажите размер.';
  }

  if (!item.condition?.trim()) {
    return 'Для публикации выберите состояние.';
  }

  if (!isPositiveNumber(item.planned_sale_price)) {
    return 'Для публикации укажите положительную планируемую цену продажи.';
  }

  if (!item.public_description?.trim()) {
    return 'Для публикации добавьте описание товара.';
  }

  if (photoCount < 1) {
    return 'Для публикации добавьте хотя бы одну фотографию.';
  }

  if (item.status === LISTED_STATUS && !item.vinted_url?.trim()) {
    return 'Для выставленного товара укажите ссылку на Vinted.';
  }

  return '';
}

export function assertValidItem(item, photoCount = 0) {
  const error = getItemValidationError(item, photoCount);

  if (error) {
    throw new Error(error);
  }
}
