import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Не заданы переменные окружения Supabase. Проверь файл .env');
}

export const STORAGE_BUCKET =
  import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'item-photos';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('URL:', supabaseUrl);
console.log('KEY EXISTS:', !!supabaseAnonKey);
console.log('BUCKET:', import.meta.env.VITE_SUPABASE_STORAGE_BUCKET);