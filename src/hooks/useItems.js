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

function createDraftError(itemId, savedLabel = 'Товар сохранён', cause) {
  const photosNeedReview = Boolean(cause?.uploadCleanupIncomplete || cause?.photosUploaded);
  const retryMessage = photosNeedReview
    ? 'Файлы уже могли сохраниться: проверьте список фотографий перед повторной загрузкой.'
    : 'Откройте товар и повторите сохранение.';
  const error = new Error(
    `${savedLabel} как непубличный черновик, но завершить работу с фотографиями и публикацией не удалось. ${retryMessage}`,
    { cause },
  );
  error.draftItemId = itemId;
  error.photosNeedReview = photosNeedReview;
  return error;
}

function markPhotosUploaded(error) {
  const wrappedError = new Error('Фотографии загружены, но обновить публикацию не удалось.', { cause: error });
  wrappedError.photosUploaded = true;
  return wrappedError;
}

function refreshQueries(queryClient, queryKeys) {
  return Promise.all(
    queryKeys.map((queryKey) =>
      queryClient.invalidateQueries({ queryKey, refetchType: 'all' }),
    ),
  );
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

  if (!photos.length) {
    return item;
  }

  let uploadedPhotos;

  try {
    uploadedPhotos = await uploadItemPhotos({ itemId: item.id, photos });
  } catch (uploadError) {
    throw createDraftError(item.id, 'Товар сохранён', uploadError);
  }

  const primaryPhotoId = getSelectedPrimaryPhotoId(payload, uploadedPhotos);

  try {
    return await updateItemStoreState({
      id: item.id,
      isPublic: requestedIsPublic,
      primaryPhotoId,
    });
  } catch (publicationError) {
    throw createDraftError(item.id, 'Товар сохранён', markPhotosUploaded(publicationError));
  }
}

async function updateItemWithPhotos(payload) {
  const photos = payload.photos ?? [];
  const photoCount = Number(payload.existing_photo_count || 0) + photos.length;
  assertValidItem(payload, photoCount);

  const requestedIsPublic = Boolean(payload.is_public);

  if (!photos.length) {
    return updateItem(payload);
  }

  await updateItem({
    ...payload,
    is_public: false,
  });

  let uploadedPhotos;

  try {
    uploadedPhotos = await uploadItemPhotos({ itemId: payload.id, photos });
  } catch (uploadError) {
    throw createDraftError(payload.id, 'Изменения сохранены', uploadError);
  }

  const primaryPhotoId = getSelectedPrimaryPhotoId(payload, uploadedPhotos);

  try {
    return await updateItemStoreState({
      id: payload.id,
      isPublic: requestedIsPublic,
      primaryPhotoId,
    });
  } catch (publicationError) {
    throw createDraftError(payload.id, 'Изменения сохранены', markPhotosUploaded(publicationError));
  }
}

async function deletePhotoWithFallback({ item, photo }) {
  const remainingPhotos = (item.item_photos ?? []).filter((candidate) => candidate.id !== photo.id);
  const deletesPrimaryPhoto = item.primary_photo_id === photo.id;
  const removesLastPhoto = remainingPhotos.length === 0;
  const needsStoreStateUpdate = deletesPrimaryPhoto || (item.is_public && removesLastPhoto);

  if (needsStoreStateUpdate) {
    await updateItemStoreState({
      id: item.id,
      isPublic: Boolean(item.is_public && remainingPhotos.length),
      primaryPhotoId: deletesPrimaryPhoto ? remainingPhotos[0]?.id ?? null : item.primary_photo_id,
    });
  }

  let storageCleanupError;

  try {
    storageCleanupError = await deletePhoto(photo);
  } catch (deletionError) {
    if (needsStoreStateUpdate) {
      try {
        await updateItemStoreState({
          id: item.id,
          isPublic: item.is_public,
          primaryPhotoId: item.primary_photo_id,
        });
      } catch {
        throw new Error(
          'Фото не удалено, а исходное состояние публикации восстановить не удалось. Обновите страницу и проверьте товар.',
          { cause: deletionError },
        );
      }
    }

    throw deletionError;
  }

  if (storageCleanupError) {
    const error = new Error(
      'Фото удалено из товара, но очистить файл в хранилище не удалось.',
      { cause: storageCleanupError },
    );
    error.photoDeleted = true;
    throw error;
  }

  return photo;
}

async function deleteItemWithPhotos(item) {
  await deleteItemRecord(item);

  try {
    await deleteItemPhotos(item);
  } catch (storageCleanupError) {
    const error = new Error(
      'Товар удалён, но очистить его файлы в хранилище не удалось.',
      { cause: storageCleanupError },
    );
    error.itemDeleted = true;
    throw error;
  }

  return item;
}

export function useItems({ enabled = true } = {}) {
  return useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
    enabled,
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
    onSettled: () => refreshQueries(queryClient, [['items']]),
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateItemWithPhotos,
    onSettled: (_, __, variables) =>
      refreshQueries(queryClient, [
        ['items'],
        ['item', variables.id],
        ['expenses'],
      ]),
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteItemWithPhotos,
    onSettled: (deletedItem, error, item) => {
      if (deletedItem || error?.itemDeleted) {
        queryClient.removeQueries({ queryKey: ['item', item.id], exact: true });
      }

      return refreshQueries(queryClient, [['items'], ['expenses']]);
    },
  });
}

export function useDeletePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePhotoWithFallback,
    onSettled: (_, __, variables) =>
      refreshQueries(queryClient, [
        ['items'],
        ['item', variables.item.id],
      ]),
  });
}
