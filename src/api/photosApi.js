import { STORAGE_BUCKET, supabase } from '../services/supabaseClient';
import { requireAuthenticatedSession, toMutationError } from './authApi';

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
  const fileExt = file.name.split('.').pop();
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
    await supabase.storage.from(STORAGE_BUCKET).remove([fileName]);
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

  for (const photo of photos) {
    uploadedPhotos.push(await uploadItemPhoto(photo, itemId));
  }

  return uploadedPhotos;
}

export async function deletePhoto(photo) {
  await requireAuthenticatedSession();

  const path = extractStoragePathFromUrl(photo.image_url);

  if (path) {
    const { error: storageError } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);

    if (storageError) {
      throw toMutationError(storageError);
    }
  }

  const { error } = await supabase.from('item_photos').delete().eq('id', photo.id);

  if (error) {
    throw toMutationError(error);
  }
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
