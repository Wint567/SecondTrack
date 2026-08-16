import { createContext, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getCurrentSession,
  signInAdmin,
  signOutAdmin,
  subscribeToAuthChanges,
} from '../api/authApi';

export const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const previousUserId = useRef(undefined);

  useEffect(() => {
    let isActive = true;
    let subscription;

    function applySession(nextSession) {
      if (!isActive) {
        return;
      }

      const nextUserId = nextSession?.user?.id ?? null;

      if (previousUserId.current !== undefined && previousUserId.current !== nextUserId) {
        queryClient.clear();
      }

      previousUserId.current = nextUserId;
      setSession(nextSession);
      setAuthError('');
      setIsLoading(false);
    }

    getCurrentSession()
      .then(({ data, error }) => {
        if (error) {
          throw error;
        }

        applySession(data.session);
      })
      .catch(() => {
        if (isActive) {
          setSession(null);
          setAuthError('Не удалось восстановить сессию. Публичный просмотр остаётся доступен.');
          setIsLoading(false);
        }
      });

    try {
      const authListener = subscribeToAuthChanges((_event, nextSession) => {
        applySession(nextSession);
      });
      subscription = authListener.data.subscription;
    } catch {
      if (isActive) {
        setAuthError('Не удалось подключить отслеживание сессии.');
        setIsLoading(false);
      }
    }

    return () => {
      isActive = false;
      subscription?.unsubscribe();
    };
  }, [queryClient]);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.user),
      isLoading,
      authError,
      clearAuthError: () => setAuthError(''),
      signIn: signInAdmin,
      signOut: signOutAdmin,
    }),
    [authError, isLoading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
