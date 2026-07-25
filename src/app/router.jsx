import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/Layout/AppLayout';
import { Dashboard } from '../pages/Dashboard';
import { Items } from '../pages/Items';
import { AddItem } from '../pages/AddItem';
import { EditItem } from '../pages/EditItem';
import { Expenses } from '../pages/Expenses';
import { Sales } from '../pages/Sales';
import { MonthlyAnalytics } from '../pages/MonthlyAnalytics';
import { Login } from '../pages/Login';
import { ErrorState } from '../components/Feedback/ErrorState';
import { RequireAuth } from '../auth/RequireAuth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorState title="Что-то пошло не так" description="Не удалось загрузить запрошенную страницу." />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'items', element: <Items /> },
      { path: 'login', element: <Login /> },
      { path: 'items/new', element: <RequireAuth><AddItem /></RequireAuth> },
      { path: 'items/:id/edit', element: <RequireAuth><EditItem /></RequireAuth> },
      { path: 'expenses', element: <Expenses /> },
      { path: 'sales', element: <Sales /> },
      { path: 'monthly', element: <MonthlyAnalytics /> },
    ],
  },
]);
