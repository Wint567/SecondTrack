import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingState } from '../components/Feedback/LoadingState';
import { ErrorState } from '../components/Feedback/ErrorState';
import { PageHeader } from '../components/UI/PageHeader';
import { ItemForm, buildItemFormState } from '../components/Forms/ItemForm';
import { useAddItemPhotos, useDeletePhoto, useItem, useUpdateItem } from '../hooks/useItems';

export function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const itemQuery = useItem(id);
  const updateItem = useUpdateItem();
  const addPhotos = useAddItemPhotos();
  const deletePhoto = useDeletePhoto();
  const [error, setError] = useState('');

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

      if (values.photos?.length) {
        await addPhotos.mutateAsync({
          itemId: id,
          photos: values.photos,
        });
      }

      navigate('/items');
    } catch (submissionError) {
      setError(submissionError.message || 'Не удалось сохранить изменения.');
    }
  }

  async function handleDeletePhoto(photo) {
    try {
      await deletePhoto.mutateAsync(photo);
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
        initialValues={buildItemFormState(itemQuery.data)}
        existingPhotos={itemQuery.data?.item_photos ?? []}
        submitLabel="Сохранить изменения"
        submitPendingLabel="Сохранение изменений..."
        onSubmit={handleSubmit}
        onDeletePhoto={handleDeletePhoto}
        onAddPhotosLabel="Добавить фото"
        isSubmitting={updateItem.isPending || addPhotos.isPending}
        deletingPhotoId={deletePhoto.variables?.id ?? null}
        error={error}
      />
    </div>
  );
}
