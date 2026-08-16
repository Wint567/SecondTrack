import { STORAGE_BUCKET, supabase } from '../services/supabaseClient';
import { requireAuthenticatedSession, toMutationError } from './authApi';

const PHOTO_EXTENSION_BY_TYPE = {
  'image/avif': 'avif',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

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

async function uploadItemPhoto(file, itemId) {
  const fileExt = PHOTO_EXTENSION_BY_TYPE[file.type];

  if (!fileExt) {
    throw new Error('Неподдерживаемый тип фотографии. Используйте JPEG, PNG, WebP или AVIF.');
  }

  const fileName = `${itemId}/${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage.from(STORAGE_BUCKET).upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (uploadError) {
    throw toMutationError(uploadError);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);

  const { data, error: photoError } = await supabase
    .from('item_photos')
    .insert({
      item_id: itemId,
      image_url: publicUrl,
    })
    .select()
    .single();

  if (photoError) {
    const { error: cleanupError } = await supabase.storage.from(STORAGE_BUCKET).remove([fileName]);

    if (cleanupError) {
      const error = new Error(
        'Не удалось сохранить фотографию и очистить загруженный файл.',
        { cause: toMutationError(photoError) },
      );
      error.uploadCleanupIncomplete = true;
      throw error;
    }

    throw toMutationError(photoError);
  }

  return data;
}

export async function uploadItemPhotos({ itemId, photos }) {
  if (!photos?.length) {
    return [];
  }

  await requireAuthenticatedSession();
  const uploadedPhotos = [];

  try {
    for (const photo of photos) {
      uploadedPhotos.push(await uploadItemPhoto(photo, itemId));
    }
  } catch (uploadError) {
    let cleanupIncomplete = Boolean(uploadError.uploadCleanupIncomplete);

    for (const uploadedPhoto of uploadedPhotos.reverse()) {
      try {
        const storageCleanupError = await deletePhoto(uploadedPhoto);
        cleanupIncomplete ||= Boolean(storageCleanupError);
      } catch {
        cleanupIncomplete = true;
      }
    }

    if (cleanupIncomplete) {
      const error = new Error(
        'Не удалось загрузить все фотографии и полностью откатить текущую загрузку.',
        { cause: uploadError },
      );
      error.uploadCleanupIncomplete = true;
      throw error;
    }

    throw uploadError;
  }

  return uploadedPhotos;
}

export async function deletePhoto(photo) {
  await requireAuthenticatedSession();

  const path = extractStoragePathFromUrl(photo.image_url);
  const { error } = await supabase.from('item_photos').delete().eq('id', photo.id);

  if (error) {
    throw toMutationError(error);
  }

  if (!path) {
    return null;
  }

  const { error: storageError } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);

  return storageError ? toMutationError(storageError) : null;
}

export async function deleteItemPhotos(item) {
  const paths = (item.item_photos ?? [])
    .map((photo) => extractStoragePathFromUrl(photo.image_url))
    .filter(Boolean);

  if (!paths.length) {
    return;
  }

  await requireAuthenticatedSession();

  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove(paths);

  if (error) {
    throw toMutationError(error);
  }
}
