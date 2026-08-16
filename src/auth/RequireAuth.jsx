import { Navigate, useLocation } from 'react-router-dom';
import { LoadingState } from '../components/Feedback/LoadingState';
import { useAuth } from './useAuth';

export function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingState label="Проверка доступа..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
