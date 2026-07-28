import { supabase } from '../services/supabaseClient';
import { SOLD_STATUS } from '../utils/constants';
import { normalizeItem } from '../utils/normalizeItem';
import { createSlug } from '../utils/slug';
import { requireAuthenticatedSession, toMutationError } from './authApi';

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
    title: itemPayload.title.trim(),
    brand: itemPayload.brand?.trim() || '',
    category: itemPayload.category?.trim() || '',
    size: itemPayload.size?.trim() || '',
    condition: itemPayload.condition?.trim() || '',
    public_description: itemPayload.public_description?.trim() || null,
    is_public: Boolean(itemPayload.is_public),
    slug: itemPayload.slug?.trim() || null,
    vinted_url: itemPayload.vinted_url?.trim() || null,
    primary_photo_id: itemPayload.primary_photo_id || null,
    purchase_date: itemPayload.purchase_date,
    purchase_price: Number(itemPayload.purchase_price),
    planned_sale_price: toNullableNumber(itemPayload.planned_sale_price),
    actual_sale_price: itemPayload.status === SOLD_STATUS ? toNullableNumber(itemPayload.actual_sale_price) : null,
    sold_at: itemPayload.status === SOLD_STATUS && itemPayload.sold_at ? itemPayload.sold_at : null,
    status: itemPayload.status,
    source_place: itemPayload.source_place?.trim() || '',
    notes: itemPayload.notes?.trim() || '',
  };
}

async function slugExists(slug, excludedItemId = null) {
  let query = supabase.from('items').select('id').eq('slug', slug).limit(1);

  if (excludedItemId) {
    query = query.neq('id', excludedItemId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw toMutationError(error);
  }

  return Boolean(data);
}

async function resolveUniqueSlug(title, existingSlug = null, itemId = null) {
  if (existingSlug?.trim()) {
    return existingSlug.trim();
  }

  const baseSlug = createSlug(title);

  if (!(await slugExists(baseSlug, itemId))) {
    return baseSlug;
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const suffix = crypto.randomUUID().replaceAll('-', '').slice(0, 6);
    const candidate = `${baseSlug}-${suffix}`;

    if (!(await slugExists(candidate, itemId))) {
      return candidate;
    }
  }

  throw new Error('Не удалось создать уникальный адрес товара. Повторите сохранение.');
}

export async function fetchItems() {
  const { data, error } = await supabase
    .from('items')
    .select('*, item_photos:item_photos!item_photos_item_id_fkey(*), expenses(*)')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(normalizeItem);
}

export async function getItemById(id) {
  const { data, error } = await supabase
    .from('items')
    .select('*, item_photos:item_photos!item_photos_item_id_fkey(*), expenses(*)')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return normalizeItem(data);
}

export async function createItem(payload) {
  await requireAuthenticatedSession();

  const slug = await resolveUniqueSlug(payload.title, payload.slug);

  const { data, error } = await supabase
    .from('items')
    .insert(buildItemPayload({ ...payload, slug }))
    .select()
    .single();

  if (error) {
    throw toMutationError(error);
  }

  return data;
}

export async function updateItem(payload) {
  await requireAuthenticatedSession();

  const { id, ...itemPayload } = payload;
  const slug = await resolveUniqueSlug(itemPayload.title, itemPayload.slug, id);

  const { data, error } = await supabase
    .from('items')
    .update(buildItemPayload({ ...itemPayload, slug }))
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw toMutationError(error);
  }

  return data;
}

export async function updateItemStoreState({ id, isPublic, primaryPhotoId }) {
  await requireAuthenticatedSession();

  const { data, error } = await supabase
    .from('items')
    .update({
      is_public: Boolean(isPublic),
      primary_photo_id: primaryPhotoId || null,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw toMutationError(error);
  }

  return data;
}

export async function deleteItemRecord(item) {
  await requireAuthenticatedSession();

  const { error } = await supabase.from('items').delete().eq('id', item.id);

  if (error) {
    throw toMutationError(error);
  }
}
