import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createItem,
  deleteItemRecord,
  fetchItems,
  getItemById,
  updateItem,
  updateItemStoreState,
} from '../api/itemsApi';
import { deleteItemPhotos, deletePhoto, uploadItemPhotos } from '../api/photosApi';
import { assertValidItem } from '../utils/itemValidation';

function getSelectedPrimaryPhotoId(payload, uploadedPhotos) {
  if (Number.isInteger(payload.primary_photo_file_index)) {
    return uploadedPhotos[payload.primary_photo_file_index]?.id
      ?? payload.primary_photo_id
      ?? uploadedPhotos[0]?.id
      ?? null;
  }

  return payload.primary_photo_id ?? uploadedPhotos[0]?.id ?? null;
}

function createDraftError(itemId, savedLabel = 'Товар сохранён') {
  const error = new Error(
    `${savedLabel} как непубличный черновик, но завершить работу с фотографиями и публикацией не удалось. Откройте товар и повторите сохранение.`,
  );
  error.draftItemId = itemId;
  return error;
}

async function createItemWithPhotos(payload) {
  const photos = payload.photos ?? [];
  assertValidItem(payload, photos.length);

  const requestedIsPublic = Boolean(payload.is_public);
  const item = await createItem({
    ...payload,
    is_public: false,
    primary_photo_id: null,
  });

  try {
    const uploadedPhotos = await uploadItemPhotos({ itemId: item.id, photos });
    const primaryPhotoId = getSelectedPrimaryPhotoId(payload, uploadedPhotos);

    return await updateItemStoreState({
      id: item.id,
      isPublic: requestedIsPublic,
      primaryPhotoId,
    });
  } catch {
    throw createDraftError(item.id);
  }
}

async function updateItemWithPhotos(payload) {
  const photos = payload.photos ?? [];
  const photoCount = Number(payload.existing_photo_count || 0) + photos.length;
  assertValidItem(payload, photoCount);

  const requestedIsPublic = Boolean(payload.is_public);
  await updateItem({
    ...payload,
    is_public: false,
  });

  try {
    const uploadedPhotos = await uploadItemPhotos({ itemId: payload.id, photos });
    const primaryPhotoId = getSelectedPrimaryPhotoId(payload, uploadedPhotos);

    return await updateItemStoreState({
      id: payload.id,
      isPublic: requestedIsPublic,
      primaryPhotoId,
    });
  } catch {
    throw createDraftError(payload.id, 'Изменения сохранены');
  }
}

async function deletePhotoWithFallback({ item, photo }) {
  const remainingPhotos = (item.item_photos ?? []).filter((candidate) => candidate.id !== photo.id);
  const deletesPrimaryPhoto = item.primary_photo_id === photo.id;
  const removesLastPhoto = remainingPhotos.length === 0;

  if (deletesPrimaryPhoto || (item.is_public && removesLastPhoto)) {
    await updateItemStoreState({
      id: item.id,
      isPublic: false,
      primaryPhotoId: deletesPrimaryPhoto ? null : item.primary_photo_id,
    });
  }

  await deletePhoto(photo);

  if (deletesPrimaryPhoto) {
    await updateItemStoreState({
      id: item.id,
      isPublic: Boolean(item.is_public && remainingPhotos.length),
      primaryPhotoId: remainingPhotos[0]?.id ?? null,
    });
  }

  return photo;
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
    mutationFn: updateItemWithPhotos,
    onSettled: (_, __, variables) => {
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

export function useDeletePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePhotoWithFallback,
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', variables.item.id] });
    },
  });
}
