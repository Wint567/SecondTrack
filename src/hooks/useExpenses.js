import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabaseClient';
import { requireAuthenticatedSession, toMutationError } from '../api/authApi';

async function fetchExpenses() {
  const { data, error } = await supabase
    .from('expenses')
    .select('*, item:items(id, title, brand)')
    .order('expense_date', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

async function createExpense(payload) {
  await requireAuthenticatedSession();

  const normalizedType = payload.type?.trim();
  const normalizedAmount = Number(payload.amount);

  if (!normalizedType) {
    throw new Error('Укажите тип расхода.');
  }

  if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
    throw new Error('Сумма расхода должна быть больше нуля.');
  }

  if (!payload.expense_date) {
    throw new Error('Укажите дату расхода.');
  }

  const { data, error } = await supabase
    .from('expenses')
    .insert({
      type: normalizedType,
      amount: normalizedAmount,
      expense_date: payload.expense_date,
      note: payload.note?.trim() || '',
      item_id: payload.item_id || null,
    })
    .select()
    .single();

  if (error) {
    throw toMutationError(error);
  }

  return data;
}

export function useExpenses() {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: fetchExpenses,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpense,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['expenses'], refetchType: 'all' }),
        queryClient.invalidateQueries({ queryKey: ['items'], refetchType: 'all' }),
      ]),
  });
}
