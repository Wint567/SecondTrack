import { useState } from 'react';
import { Eye, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { ToastMessage } from '../UI/ToastMessage';

export function Header() {
  const { isAuthenticated, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState('');

  async function handleSignOut() {
    setError('');
    setIsSigningOut(true);

    try {
      await signOut();
    } catch (signOutError) {
      setError(signOutError.message || 'Не удалось выйти из аккаунта.');
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Личный кабинет учёта</p>
            <h2 className="truncate text-lg font-semibold text-white sm:text-xl">Аналитика перепродажи одежды</h2>
          </div>

          <div className="flex flex-none items-center gap-2 sm:gap-3">
            <div className="hidden rounded-2xl border border-slate-800/90 bg-slate-900/60 px-4 py-2 text-right shadow-panel md:block">
              <p className="flex items-center justify-end gap-1.5 text-xs text-slate-500">
                {isAuthenticated ? <ShieldCheck className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                Режим приложения
              </p>
              <p className="text-sm font-medium text-slate-200">
                {isAuthenticated ? 'Администратор' : 'Публичный просмотр'}
              </p>
            </div>

            {isAuthenticated ? (
              <button
                type="button"
                className="button-secondary px-3 sm:px-4"
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{isSigningOut ? 'Выход...' : 'Выйти'}</span>
              </button>
            ) : (
              <Link to="/login" className="button-secondary px-3 sm:px-4">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Войти</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <ToastMessage message={error} tone="error" onClose={() => setError('')} />
    </>
  );
}
