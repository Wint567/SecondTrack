import { ITEM_CATEGORIES, ITEM_STATUSES } from '../../utils/constants';

export function ItemFilters({ filters, onChange, categoryOptions = ITEM_CATEGORIES }) {
  return (
    <div className="grid min-w-0 max-w-full gap-3 rounded-2xl border border-slate-800/90 bg-slate-900/60 p-3 shadow-panel backdrop-blur-xl sm:p-4 md:grid-cols-2 xl:grid-cols-4">
      <label className="min-w-0">
        <span className="sr-only">Фильтр по статусу</span>
        <select
          className="select min-w-0"
          value={filters.status}
          onChange={(event) => onChange('status', event.target.value)}
        >
          <option value="">Все статусы</option>
          {ITEM_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      <label className="min-w-0">
        <span className="sr-only">Фильтр по бренду</span>
        <input
          className="input min-w-0"
          type="text"
          placeholder="Фильтр по бренду"
          value={filters.brand}
          onChange={(event) => onChange('brand', event.target.value)}
        />
      </label>

      <label className="min-w-0">
        <span className="sr-only">Фильтр по категории</span>
        <select
          className="select min-w-0"
          value={filters.category}
          onChange={(event) => onChange('category', event.target.value)}
        >
          <option value="">Все категории</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="min-w-0">
        <span className="sr-only">Фильтр по дате покупки</span>
        <input
          className="input min-w-0"
          type="date"
          value={filters.date}
          onChange={(event) => onChange('date', event.target.value)}
        />
      </label>
    </div>
  );
}
