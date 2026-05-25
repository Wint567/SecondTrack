import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/UI/PageHeader';
import { ItemForm, itemInitialForm } from '../components/Forms/ItemForm';
import { useCreateItem } from '../hooks/useItems';

export function AddItem() {
  const navigate = useNavigate();
  const createItem = useCreateItem();
  const [error, setError] = useState('');

  async function handleSubmit(values) {
    setError('');

    try {
      await createItem.mutateAsync(values);
      navigate('/items');
    } catch (submissionError) {
      setError(submissionError.message || 'Не удалось сохранить вещь.');
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Новая вещь"
        title="Добавить вещь"
        description="Заполните детали закупки, цены, текущий статус и загрузите фотографии товара."
      />

      <ItemForm
        mode="create"
        initialValues={itemInitialForm}
        existingPhotos={[]}
        submitLabel="Сохранить вещь"
        submitPendingLabel="Сохранение..."
        onSubmit={handleSubmit}
        isSubmitting={createItem.isPending}
        error={error}
      />
    </div>
  );
}
