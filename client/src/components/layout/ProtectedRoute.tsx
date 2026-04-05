import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

type Props = { children: ReactNode };

export function ProtectedRoute({ children }: Props) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="text-white p-8">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}