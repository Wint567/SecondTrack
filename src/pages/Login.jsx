import { useState } from 'react';
import { LogIn, ShieldCheck } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Field } from '../components/Forms/Field';
import { PageHeader } from '../components/UI/PageHeader';
import { useAuth } from '../auth/useAuth';

export function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError('');

    if (!email.trim() || !password) {
      setError('Введите email и пароль администратора.');
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn({ email: email.trim(), password });
      navigate('/dashboard', { replace: true });
    } catch (submissionError) {
      setPassword('');
      setError(submissionError.message || 'Не удалось войти.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        eyebrow="Доступ администратора"
        title="Вход в SecondTrack"
        description="Публичный просмотр доступен без входа. Авторизация нужна только для управления товарами, расходами и фотографиями."
      />

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div className="flex items-start gap-3 rounded-2xl border border-sky-400/20 bg-sky-400/10 p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-sky-300" />
          <p className="text-sm leading-relaxed text-slate-300">
            Используйте учётные данные администратора, заранее созданные в Supabase Auth.
          </p>
        </div>

        <Field label="Email" htmlFor="admin-email">
          <input
            id="admin-email"
            className="input"
            type="email"
            autoComplete="username"
            autoCapitalize="none"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting}
            required
          />
        </Field>

        <Field label="Пароль" htmlFor="admin-password">
          <input
            id="admin-password"
            className="input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
            required
          />
        </Field>

        {error ? (
          <div role="alert" className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          className="button-primary w-full"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          <LogIn className="h-4 w-4" />
          {isSubmitting ? 'Вход...' : 'Войти как администратор'}
        </button>
      </form>
    </div>
  );
}
