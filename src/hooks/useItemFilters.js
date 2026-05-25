import { useMemo, useState } from 'react';

export function useItemFilters(items = []) {
  const [filters, setFilters] = useState({
    status: '',
    brand: '',
    category: '',
    date: '',
  });

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesStatus = !filters.status || item.status === filters.status;
      const matchesBrand = !filters.brand || (item.brand ?? '').toLowerCase().includes(filters.brand.toLowerCase());
      const matchesCategory = !filters.category || item.category === filters.category;
      const matchesDate = !filters.date || item.purchase_date === filters.date;

      return matchesStatus && matchesBrand && matchesCategory && matchesDate;
    });
  }, [filters, items]);

  return {
    filters,
    setFilters,
    filteredItems,
  };
}
