import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/UI/PageHeader';
import { ItemForm, createItemInitialForm } from '../components/Forms/ItemForm';
import { useCreateItem } from '../hooks/useItems';

export function AddItem() {
  const navigate = useNavigate();
  const createItem = useCreateItem();
  const [error, setError] = useState('');
  const [initialValues] = useState(createItemInitialForm);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  async function handleSubmit(values) {
    setError('');

    try {
      await createItem.mutateAsync(values);
      if (isMountedRef.current) {
        navigate('/items');
      }
    } catch (submissionError) {
      if (!isMountedRef.current) {
        return;
      }

      if (submissionError.draftItemId) {
        navigate(`/items/${submissionError.draftItemId}/edit`, {
          state: { submissionError: submissionError.message },
        });
        return;
      }

      setError(submissionError.message || 'Не удалось сохранить вещь.');
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Новая вещь"
        title="Добавить вещь"
        description="Заполните данные для будущего магазина, внутреннего учёта и загрузите фотографии товара."
      />

      <ItemForm
        mode="create"
        initialValues={initialValues}
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
