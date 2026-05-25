import { Link } from 'react-router-dom';
import { EmptyState } from '../components/Feedback/EmptyState';
import { ErrorState } from '../components/Feedback/ErrorState';
import { LoadingState } from '../components/Feedback/LoadingState';
import { ItemFilters } from '../components/ItemTable/ItemFilters';
import { ItemTable } from '../components/ItemTable/ItemTable';
import { PageHeader } from '../components/UI/PageHeader';
import { useItemFilters } from '../hooks/useItemFilters';
import { useDeleteItem, useItems } from '../hooks/useItems';

export function Items() {
  const itemsQuery = useItems();
  const deleteItem = useDeleteItem();
  const { filters, setFilters, filteredItems } = useItemFilters(itemsQuery.data ?? []);

  async function handleDelete(item) {
    const confirmed = window.confirm('Удалить вещь?');

    if (!confirmed) {
      return;
    }

    try {
      await deleteItem.mutateAsync(item);
    } catch (error) {
      window.alert(error.message || 'Не удалось удалить вещь.');
    }
  }

  if (itemsQuery.isLoading) {
    return <LoadingState label="Загрузка товаров..." />;
  }

  if (itemsQuery.isError) {
    return <ErrorState description={itemsQuery.error?.message || 'Не удалось загрузить товары.'} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Товары"
        title="Все добавленные вещи"
        description="Фильтруйте и просматривайте закупки, продажи, расходы и прибыль в одной таблице."
        action={
          <Link to="/items/new" className="button-primary">
            Добавить вещь
          </Link>
        }
      />

      <ItemFilters
        filters={filters}
        onChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
      />

      {filteredItems.length ? (
        <ItemTable
          items={filteredItems}
          deletingItemId={deleteItem.variables?.id ?? null}
          onDelete={handleDelete}
        />
      ) : (
        <EmptyState
          title="По выбранным фильтрам ничего не найдено"
          description="Сбросьте фильтры или добавьте новую вещь, чтобы начать учёт."
          action={
            <Link to="/items/new" className="button-primary">
              Добавить вещь
            </Link>
          }
        />
      )}
    </div>
  );
}
