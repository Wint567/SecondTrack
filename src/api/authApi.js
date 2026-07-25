import { supabase } from '../services/supabaseClient';

const AUTH_REQUIRED_MESSAGE = 'Войдите как администратор, чтобы изменять данные.';
const SIGN_IN_FAILED_MESSAGE = 'Не удалось войти. Проверьте соединение и попробуйте ещё раз.';
const SIGN_OUT_FAILED_MESSAGE = 'Не удалось выйти из аккаунта. Попробуйте ещё раз.';

function isPermissionError(error) {
  return (
    error?.code === '42501' ||
    error?.status === 401 ||
    error?.status === 403 ||
    Number(error?.statusCode) === 401 ||
    Number(error?.statusCode) === 403 ||
    /row-level security|permission denied|not authorized|unauthorized/i.test(error?.message ?? '')
  );
}

export function toMutationError(error) {
  if (isPermissionError(error)) {
    return new Error(AUTH_REQUIRED_MESSAGE, { cause: error });
  }

  return error;
}

export async function getCurrentSession() {
  return supabase.auth.getSession();
}

export function subscribeToAuthChanges(callback) {
  return supabase.auth.onAuthStateChange(callback);
}

export async function signInAdmin({ email, password }) {
  let response;

  try {
    response = await supabase.auth.signInWithPassword({ email, password });
  } catch (error) {
    throw new Error(SIGN_IN_FAILED_MESSAGE, { cause: error });
  }

  const { data, error } = response;

  if (error) {
    if (error.status === 400 || /invalid login credentials/i.test(error.message ?? '')) {
      throw new Error('Неверный email или пароль.', { cause: error });
    }

    throw new Error(SIGN_IN_FAILED_MESSAGE, { cause: error });
  }

  return data;
}

export async function signOutAdmin() {
  let response;

  try {
    response = await supabase.auth.signOut();
  } catch (error) {
    throw new Error(SIGN_OUT_FAILED_MESSAGE, { cause: error });
  }

  const { error } = response;

  if (error) {
    throw new Error(SIGN_OUT_FAILED_MESSAGE, { cause: error });
  }
}

export async function requireAuthenticatedSession() {
  let response;

  try {
    response = await supabase.auth.getSession();
  } catch (error) {
    throw new Error('Не удалось проверить права доступа. Попробуйте ещё раз.', { cause: error });
  }

  const { data, error } = response;

  if (error) {
    throw new Error('Не удалось проверить права доступа. Попробуйте ещё раз.', { cause: error });
  }

  if (!data.session) {
    throw new Error(AUTH_REQUIRED_MESSAGE);
  }

  return data.session;
}
