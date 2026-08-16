import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/Feedback/EmptyState';
import { ErrorState } from '../components/Feedback/ErrorState';
import { LoadingState } from '../components/Feedback/LoadingState';
import { RefetchWarning } from '../components/Feedback/RefetchWarning';
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
  const hasActiveFilters = Object.values(filters).some(Boolean);
  const hasItems = Boolean(itemsQuery.data?.length);
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
    if (!itemToDelete || deleteItem.isPending) {
      return;
    }

    try {
      await deleteItem.mutateAsync(itemToDelete);
      setItemToDelete(null);
    } catch (error) {
      if (error.itemDeleted) {
        setItemToDelete(null);
      }

      setToast({
        tone: 'error',
        message: error.message || 'Не удалось удалить вещь.',
      });
    }
  }

  if (itemsQuery.isLoading) {
    return <LoadingState label="Загрузка товаров..." />;
  }

  if (itemsQuery.isError && itemsQuery.data === undefined) {
    return (
      <ErrorState
        description={itemsQuery.error?.message || 'Не удалось загрузить товары.'}
        onRetry={itemsQuery.refetch}
      />
    );
  }

  return (
    <div className="min-w-0 space-y-6">
      {itemsQuery.isError && itemsQuery.data !== undefined ? (
        <RefetchWarning onRetry={() => itemsQuery.refetch()} />
      ) : null}

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
          deletingItemId={deleteItem.isPending ? deleteItem.variables?.id ?? null : null}
          onDelete={handleDeleteRequest}
          canManage={isAuthenticated}
        />
      ) : (
        <EmptyState
          title={hasItems ? 'По выбранным фильтрам ничего не найдено' : 'Товаров пока нет'}
          description={hasItems
            ? 'Измените или сбросьте фильтры, чтобы вернуться к доступным товарам.'
            : isAuthenticated
              ? 'Добавьте первую вещь, чтобы начать учёт.'
              : 'Когда в демо появятся товары, они будут доступны здесь для просмотра.'}
          action={hasItems && hasActiveFilters ? (
            <button
              type="button"
              className="button-secondary w-full sm:w-auto"
              onClick={() => setFilters({ status: '', brand: '', category: '', date: '' })}
            >
              Сбросить фильтры
            </button>
          ) : isAuthenticated ? (
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
