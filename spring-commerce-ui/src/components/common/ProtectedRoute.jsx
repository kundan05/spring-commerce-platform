import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, user, loading } = useSelector(state => state.auth);

  if (loading) return null;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requireAdmin && user?.role !== 'ROLE_ADMIN') return <Navigate to="/" replace />;

  return children;
}
