import { ITEM_CATEGORIES, ITEM_STATUSES } from '../../utils/constants';

export function ItemFilters({ filters, onChange }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:grid-cols-2 xl:grid-cols-4">
      <select
        className="select"
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

      <input
        className="input"
        type="text"
        placeholder="Фильтр по бренду"
        value={filters.brand}
        onChange={(event) => onChange('brand', event.target.value)}
      />

      <select
        className="select"
        value={filters.category}
        onChange={(event) => onChange('category', event.target.value)}
      >
        <option value="">Все категории</option>
        {ITEM_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <input
        className="input"
        type="date"
        value={filters.date}
        onChange={(event) => onChange('date', event.target.value)}
      />
    </div>
  );
}
