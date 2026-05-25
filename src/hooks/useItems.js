import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { STORAGE_BUCKET, supabase } from '../services/supabaseClient';
import { SOLD_STATUS } from '../utils/constants';

function normalizeItem(item) {
  const total_expenses = (item.expenses ?? []).reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const purchasePrice = Number(item.purchase_price || 0);
  const actualSalePrice = Number(item.actual_sale_price || 0);
  const profit = actualSalePrice - purchasePrice - total_expenses;

  return {
    ...item,
    total_expenses,
    primary_photo: item.item_photos?.[0]?.image_url ?? null,
    profit,
  };
}

function toNullableNumber(value) {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  return Number(value);
}

function extractStoragePathFromUrl(imageUrl) {
  if (!imageUrl) {
    return null;
  }

  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const markerIndex = imageUrl.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return decodeURIComponent(imageUrl.slice(markerIndex + marker.length));
}

async function fetchItems() {
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

async function uploadItemPhoto(file, itemId) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${itemId}/${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage.from(STORAGE_BUCKET).upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (uploadError) {
    throw uploadError;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);

  const { error: photoError } = await supabase.from('item_photos').insert({
    item_id: itemId,
    image_url: publicUrl,
  });

  if (photoError) {
    throw photoError;
  }
}

async function uploadItemPhotos({ itemId, photos }) {
  if (!photos?.length) {
    return;
  }

  for (const photo of photos) {
    await uploadItemPhoto(photo, itemId);
  }
}

async function createItem(payload) {
  const { photos, ...itemPayload } = payload;

  const insertPayload = {
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

  const { data, error } = await supabase
    .from('items')
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  await uploadItemPhotos({ itemId: data.id, photos });

  return data;
}

export async function updateItem(payload) {
  const { id, ...itemPayload } = payload;

  const updatePayload = {
    title: itemPayload.title,
    brand: itemPayload.brand || '',
    category: itemPayload.category || '',
    size: itemPayload.size || '',
    condition: itemPayload.condition || '',
    purchase_date: itemPayload.purchase_date,
    purchase_price: Number(itemPayload.purchase_price),
    planned_sale_price: toNullableNumber(itemPayload.planned_sale_price),
    status: itemPayload.status,
    source_place: itemPayload.source_place || '',
    notes: itemPayload.notes || '',
    sold_at: itemPayload.status === SOLD_STATUS && itemPayload.sold_at ? itemPayload.sold_at : null,
    actual_sale_price: itemPayload.status === SOLD_STATUS ? toNullableNumber(itemPayload.actual_sale_price) : null,
  };

  const { data, error } = await supabase
    .from('items')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deletePhoto(photo) {
  const path = extractStoragePathFromUrl(photo.image_url);

  if (path) {
    const { error: storageError } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);

    if (storageError) {
      throw storageError;
    }
  }

  const { error } = await supabase.from('item_photos').delete().eq('id', photo.id);

  if (error) {
    throw error;
  }
}

export async function deleteItem(item) {
  const paths = (item.item_photos ?? [])
    .map((photo) => extractStoragePathFromUrl(photo.image_url))
    .filter(Boolean);

  if (paths.length) {
    const { error: storageError } = await supabase.storage.from(STORAGE_BUCKET).remove(paths);

    if (storageError) {
      throw storageError;
    }
  }

  const { error } = await supabase.from('items').delete().eq('id', item.id);

  if (error) {
    throw error;
  }
}

export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
  });
}

export function useItem(id) {
  return useQuery({
    queryKey: ['item', id],
    queryFn: () => getItemById(id),
    enabled: Boolean(id),
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateItem,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}

export function useAddItemPhotos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadItemPhotos,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', variables.itemId] });
    },
  });
}

export function useDeletePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePhoto,
    onSuccess: (_, photo) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', photo.item_id] });
    },
  });
}
