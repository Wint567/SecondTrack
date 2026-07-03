import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createItem, deleteItemRecord, fetchItems, getItemById, updateItem } from '../api/itemsApi';
import { deleteItemPhotos, deletePhoto, uploadItemPhotos } from '../api/photosApi';

async function createItemWithPhotos(payload) {
  const { photos, ...itemPayload } = payload;
  const item = await createItem(itemPayload);

  await uploadItemPhotos({ itemId: item.id, photos });

  return item;
}

async function deleteItemWithPhotos(item) {
  await deleteItemPhotos(item);
  await deleteItemRecord(item);
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
    mutationFn: createItemWithPhotos,
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
    mutationFn: deleteItemWithPhotos,
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
