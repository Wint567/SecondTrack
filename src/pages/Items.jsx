import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/Feedback/EmptyState';
import { ErrorState } from '../components/Feedback/ErrorState';
import { LoadingState } from '../components/Feedback/LoadingState';
import { ItemFilters } from '../components/ItemTable/ItemFilters';
import { ItemTable } from '../components/ItemTable/ItemTable';
import { ConfirmDialog } from '../components/UI/ConfirmDialog';
import { PageHeader } from '../components/UI/PageHeader';
import { ToastMessage } from '../components/UI/ToastMessage';
import { useItemFilters } from '../hooks/useItemFilters';
import { useDeleteItem, useItems } from '../hooks/useItems';
import { useAuth } from '../auth/useAuth';
import { ITEM_CATEGORIES } from '../utils/constants';

export function Items() {
  const { isAuthenticated } = useAuth();
  const itemsQuery = useItems();
  const deleteItem = useDeleteItem();
  const { filters, setFilters, filteredItems } = useItemFilters(itemsQuery.data ?? []);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const categoryOptions = useMemo(() => {
    const savedCategories = (itemsQuery.data ?? [])
      .map((item) => item.category)
      .filter(Boolean);

    return [...new Set([...ITEM_CATEGORIES, ...savedCategories])];
  }, [itemsQuery.data]);

  function handleDeleteRequest(item) {
    if (!isAuthenticated) {
      setToast({ tone: 'error', message: 'Войдите как администратор, чтобы удалять товары.' });
      return;
    }

    setItemToDelete(item);
  }

  async function handleConfirmDelete() {
    if (!itemToDelete) {
      return;
    }

    try {
      await deleteItem.mutateAsync(itemToDelete);
      setItemToDelete(null);
    } catch (error) {
      setToast({
        tone: 'error',
        message: error.message || 'Не удалось удалить вещь.',
      });
    }
  }

  if (itemsQuery.isLoading) {
    return <LoadingState label="Загрузка товаров..." />;
  }

  if (itemsQuery.isError) {
    return <ErrorState description={itemsQuery.error?.message || 'Не удалось загрузить товары.'} />;
  }

  return (
    <div className="min-w-0 space-y-6">
      <PageHeader
        eyebrow="Товары"
        title="Все добавленные вещи"
        description="Фильтруйте и просматривайте закупки, продажи, расходы и прибыль в одной таблице."
        action={isAuthenticated ? (
          <Link to="/items/new" className="button-primary w-full sm:w-auto">
            Добавить вещь
          </Link>
        ) : null}
      />

      <ItemFilters
        filters={filters}
        categoryOptions={categoryOptions}
        onChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
      />

      {filteredItems.length ? (
        <ItemTable
          items={filteredItems}
          deletingItemId={deleteItem.variables?.id ?? null}
          onDelete={handleDeleteRequest}
          canManage={isAuthenticated}
        />
      ) : (
        <EmptyState
          title="По выбранным фильтрам ничего не найдено"
          description={isAuthenticated ? 'Сбросьте фильтры или добавьте новую вещь, чтобы начать учёт.' : 'Сбросьте фильтры, чтобы вернуться к доступным товарам.'}
          action={isAuthenticated ? (
            <Link to="/items/new" className="button-primary w-full sm:w-auto">
              Добавить вещь
            </Link>
          ) : null}
        />
      )}

      <ConfirmDialog
        open={isAuthenticated && Boolean(itemToDelete)}
        title="Удалить вещь?"
        description={itemToDelete ? `Вещь “${itemToDelete.title}” и её фотографии будут удалены.` : ''}
        confirmLabel="Удалить"
        isPending={deleteItem.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />

      <ToastMessage
        message={toast?.message}
        tone={toast?.tone}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
