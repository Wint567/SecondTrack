import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const STORAGE_BUCKET =
  import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'item-photos';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const missingConfigError = new Error(
  'Не заданы переменные окружения Supabase. Проверьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY.',
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy(
      {},
      {
        get() {
          throw missingConfigError;
        },
      },
    );
