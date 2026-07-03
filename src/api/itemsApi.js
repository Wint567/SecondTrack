import { supabase } from '../services/supabaseClient';
import { SOLD_STATUS } from '../utils/constants';
import { normalizeItem } from '../utils/normalizeItem';

function toNullableNumber(value) {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  return Number(value);
}

function buildItemPayload(itemPayload) {
  if (itemPayload.status === SOLD_STATUS) {
    if (!itemPayload.actual_sale_price || Number(itemPayload.actual_sale_price) <= 0) {
      throw new Error('Для проданного товара укажите фактическую цену продажи.');
    }

    if (!itemPayload.sold_at) {
      throw new Error('Для проданного товара укажите дату продажи.');
    }
  }

  return {
    title: itemPayload.title,
    brand: itemPayload.brand || '',
    category: itemPayload.category || '',
    size: itemPayload.size || '',
    condition: itemPayload.condition || '',
    purchase_date: itemPayload.purchase_date,
    purchase_price: Number(itemPayload.purchase_price),
    planned_sale_price: toNullableNumber(itemPayload.planned_sale_price),
    actual_sale_price: itemPayload.status === SOLD_STATUS ? toNullableNumber(itemPayload.actual_sale_price) : null,
    sold_at: itemPayload.status === SOLD_STATUS && itemPayload.sold_at ? itemPayload.sold_at : null,
    status: itemPayload.status,
    source_place: itemPayload.source_place || '',
    notes: itemPayload.notes || '',
  };
}

export async function fetchItems() {
  const { data, error } = await supabase
    .from('items')
    .select('*, item_photos(*), expenses(*)')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(normalizeItem);
}

export async function getItemById(id) {
  const { data, error } = await supabase
    .from('items')
    .select('*, item_photos(*), expenses(*)')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return normalizeItem(data);
}

export async function createItem(payload) {
  const { data, error } = await supabase
    .from('items')
    .insert(buildItemPayload(payload))
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateItem(payload) {
  const { id, ...itemPayload } = payload;

  const { data, error } = await supabase
    .from('items')
    .update(buildItemPayload(itemPayload))
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteItemRecord(item) {
  const { error } = await supabase.from('items').delete().eq('id', item.id);

  if (error) {
    throw error;
  }
}
