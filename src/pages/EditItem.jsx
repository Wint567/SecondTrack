import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { LoadingState } from '../components/Feedback/LoadingState';
import { ErrorState } from '../components/Feedback/ErrorState';
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
  const initialValues = useMemo(
    () => buildItemFormState(itemQuery.data),
    [itemQuery.data],
  );

  if (itemQuery.isLoading) {
    return <LoadingState label="Загрузка вещи..." />;
  }

  if (itemQuery.isError) {
    return <ErrorState description={itemQuery.error?.message || 'Не удалось загрузить вещь.'} />;
  }

  async function handleSubmit(values) {
    setError('');

    try {
      await updateItem.mutateAsync({
        id,
        ...values,
      });

      navigate('/items');
    } catch (submissionError) {
      setError(submissionError.message || 'Не удалось сохранить изменения.');
    }
  }

  async function handleDeletePhoto(photo) {
    try {
      await deletePhoto.mutateAsync({
        item: itemQuery.data,
        photo,
      });
    } catch (photoError) {
      setError(photoError.message || 'Не удалось удалить фото.');
    }
  }

  return (
    <div className="space-y-6">
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
        deletingPhotoId={deletePhoto.variables?.photo?.id ?? null}
        error={error}
      />
    </div>
  );
}
