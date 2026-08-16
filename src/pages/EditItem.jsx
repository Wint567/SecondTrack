import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { LoadingState } from '../components/Feedback/LoadingState';
import { ErrorState } from '../components/Feedback/ErrorState';
import { RefetchWarning } from '../components/Feedback/RefetchWarning';
import { PageHeader } from '../components/UI/PageHeader';
import { ItemForm, buildItemFormState } from '../components/Forms/ItemForm';
import { useDeletePhoto, useItem, useUpdateItem } from '../hooks/useItems';

export function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const itemQuery = useItem(id);
  const updateItem = useUpdateItem();
  const deletePhoto = useDeletePhoto();
  const [error, setError] = useState(location.state?.submissionError ?? '');
  const mutationLockRef = useRef(false);
  const isMountedRef = useRef(true);
  const initialValues = useMemo(
    () => buildItemFormState(itemQuery.data),
    [itemQuery.data],
  );

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  if (itemQuery.isLoading) {
    return <LoadingState label="Загрузка вещи..." />;
  }

  if (itemQuery.isError && itemQuery.data === undefined) {
    return (
      <ErrorState
        description={itemQuery.error?.message || 'Не удалось загрузить вещь.'}
        onRetry={itemQuery.refetch}
      />
    );
  }

  async function handleSubmit(values) {
    if (mutationLockRef.current) {
      return;
    }

    mutationLockRef.current = true;
    setError('');

    try {
      await updateItem.mutateAsync({
        id,
        ...values,
      });

      if (isMountedRef.current) {
        navigate('/items');
      }
    } catch (submissionError) {
      if (isMountedRef.current) {
        setError(submissionError.message || 'Не удалось сохранить изменения.');
      }

      return { resetSelectedPhotos: Boolean(submissionError.photosNeedReview) };
    } finally {
      mutationLockRef.current = false;
    }
  }

  async function handleDeletePhoto(photo) {
    if (mutationLockRef.current) {
      return;
    }

    mutationLockRef.current = true;
    setError('');

    try {
      await deletePhoto.mutateAsync({
        item: itemQuery.data,
        photo,
      });
      return { success: true };
    } catch (photoError) {
      const message = photoError.message || 'Не удалось удалить фото.';

      if (isMountedRef.current && photoError.photoDeleted) {
        setError(message);
      }

      return { success: Boolean(photoError.photoDeleted), message };
    } finally {
      mutationLockRef.current = false;
    }
  }

  return (
    <div className="space-y-6">
      {itemQuery.isError && itemQuery.data !== undefined ? (
        <RefetchWarning onRetry={() => itemQuery.refetch()} />
      ) : null}

      <PageHeader
        eyebrow="Редактирование"
        title="Редактировать вещь"
        description="Измените данные товара, обновите статус, добавьте новые фотографии или удалите ненужные."
      />

      <ItemForm
        mode="edit"
        initialValues={initialValues}
        existingPhotos={itemQuery.data?.item_photos ?? []}
        submitLabel="Сохранить изменения"
        submitPendingLabel="Сохранение изменений..."
        onSubmit={handleSubmit}
        onDeletePhoto={handleDeletePhoto}
        onAddPhotosLabel="Добавить фото"
        isSubmitting={updateItem.isPending}
        deletingPhotoId={deletePhoto.isPending ? deletePhoto.variables?.photo?.id ?? null : null}
        error={error}
      />
    </div>
  );
}
