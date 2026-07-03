import { useMemo, useState } from 'react';
import { EmptyState } from '../components/Feedback/EmptyState';
import { ErrorState } from '../components/Feedback/ErrorState';
import { LoadingState } from '../components/Feedback/LoadingState';
import { Field } from '../components/Forms/Field';
import { PageHeader } from '../components/UI/PageHeader';
import { DataTableShell } from '../components/UI/DataTableShell';
import { useCreateExpense, useExpenses } from '../hooks/useExpenses';
import { useItems } from '../hooks/useItems';
import { EXPENSE_TYPES } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/formatters';

const initialForm = {
  item_id: null,
  type: 'Доставка',
  amount: '',
  expense_date: new Date().toISOString().slice(0, 10),
  note: '',
};

function ExpenseCard({ expense }) {
  return (
    <article className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-4 shadow-panel backdrop-blur-xl transition hover:border-slate-700/90">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-white">{expense.type}</p>
          <p className="mt-1 truncate text-xs text-slate-500">{expense.item?.title || 'Общий расход'}</p>
        </div>
        <p className="whitespace-nowrap rounded-xl border border-rose-400/20 bg-rose-400/10 px-2.5 py-1 font-semibold tabular-nums text-rose-200">
          {formatCurrency(expense.amount)}
        </p>
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950/35 p-3">
          <p className="text-xs text-slate-500">Дата</p>
          <p className="mt-1 font-medium text-slate-100">{formatDate(expense.expense_date)}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/35 p-3">
          <p className="text-xs text-slate-500">Комментарий</p>
          <p className="mt-1 line-clamp-3 text-slate-300">{expense.note || 'Без комментария'}</p>
        </div>
      </div>
    </article>
  );
}

export function Expenses() {
  const expensesQuery = useExpenses();
  const itemsQuery = useItems();
  const createExpense = useCreateExpense();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  const items = useMemo(() => itemsQuery.data ?? [], [itemsQuery.data]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!form.type?.trim()) {
      setError('Укажите тип расхода.');
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      setError('Сумма расхода должна быть больше нуля.');
      return;
    }

    try {
      await createExpense.mutateAsync({
        ...form,
        amount: Number(form.amount),
        item_id: form.item_id ?? null,
      });
      setForm(initialForm);
    } catch (submissionError) {
      setError(submissionError.message || 'Не удалось сохранить расход.');
    }
  }

  if (expensesQuery.isLoading || itemsQuery.isLoading) {
    return <LoadingState label="Загрузка расходов..." />;
  }

  if (expensesQuery.isError || itemsQuery.isError) {
    return <ErrorState description={expensesQuery.error?.message || itemsQuery.error?.message || 'Не удалось загрузить расходы.'} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Расходы"
        title="Учитывайте все издержки"
        description="Фиксируйте доставку, чистку, ремонт, комиссии и прочие расходы с привязкой к товару или без неё."
      />

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,420px),minmax(0,1fr)]">
        <form onSubmit={handleSubmit} className="card space-y-4 xl:sticky xl:top-28 xl:self-start">
          <h3 className="text-lg font-semibold text-white">Добавить расход</h3>

          <Field label="Тип расхода" htmlFor="expense-type">
            <select
              id="expense-type"
              className="select"
              value={form.type}
              onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
              required
            >
              {EXPENSE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Сумма" htmlFor="expense-amount" error={error}>
            <input
              id="expense-amount"
              className="input"
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
              required
            />
          </Field>

          <Field label="Дата расхода" htmlFor="expense-date">
            <input
              id="expense-date"
              className="input"
              type="date"
              value={form.expense_date}
              onChange={(event) => setForm((current) => ({ ...current, expense_date: event.target.value }))}
              required
            />
          </Field>

          <Field label="Связанный товар" htmlFor="expense-item">
            <select
              id="expense-item"
              className="select"
              value={form.item_id ?? ''}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  item_id: event.target.value === '' ? null : event.target.value,
                }))
              }
            >
              <option value="">Без привязки к товару</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title} {item.brand ? `(${item.brand})` : ''}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Комментарий" htmlFor="expense-note">
            <textarea
              id="expense-note"
              className="textarea"
              value={form.note}
              onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
              placeholder="Дополнительные детали"
            />
          </Field>

          <button type="submit" className="button-primary w-full" disabled={createExpense.isPending}>
            {createExpense.isPending ? 'Сохранение...' : 'Сохранить расход'}
          </button>
        </form>

        <DataTableShell title="История расходов" description="Последние операционные расходы по товарам и процессу продажи.">
          {expensesQuery.data?.length ? (
            <>
              <div className="grid gap-3 md:hidden">
                {expensesQuery.data.map((expense) => (
                  <ExpenseCard key={expense.id} expense={expense} />
                ))}
              </div>

              <div className="hidden max-w-full overflow-x-auto rounded-2xl border border-slate-800/90 bg-slate-900/60 shadow-panel backdrop-blur-xl md:block">
                <table className="w-full min-w-[800px] divide-y divide-slate-800">
                  <thead className="bg-slate-950/60 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                    <tr>
                      <th className="whitespace-nowrap px-4 py-3 sm:px-5 sm:py-4">Тип</th>
                      <th className="min-w-[220px] px-4 py-3 sm:px-5 sm:py-4">Товар</th>
                      <th className="whitespace-nowrap px-4 py-3 sm:px-5 sm:py-4">Дата</th>
                      <th className="whitespace-nowrap px-4 py-3 sm:px-5 sm:py-4">Сумма</th>
                      <th className="min-w-[220px] px-4 py-3 sm:px-5 sm:py-4">Комментарий</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm">
                    {expensesQuery.data.map((expense) => (
                      <tr key={expense.id} className="hover:bg-slate-800/40">
                        <td className="whitespace-nowrap px-4 py-3 text-white sm:px-5 sm:py-4">{expense.type}</td>
                        <td className="px-4 py-3 text-slate-300 sm:px-5 sm:py-4">{expense.item?.title || 'Общий расход'}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-400 sm:px-5 sm:py-4">{formatDate(expense.expense_date)}</td>
                        <td className="whitespace-nowrap px-4 py-3 font-semibold tabular-nums text-rose-200 sm:px-5 sm:py-4">{formatCurrency(expense.amount)}</td>
                        <td className="px-4 py-3 text-slate-400 sm:px-5 sm:py-4">
                          <span className="line-clamp-2">{expense.note || 'Без комментария'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <EmptyState title="Расходов пока нет" description="Добавьте первый расход на доставку, ремонт или комиссию, чтобы точнее считать маржу." />
          )}
        </DataTableShell>
      </div>
    </div>
  );
}
