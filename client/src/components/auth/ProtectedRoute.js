import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const ProtectedRoute = ({ children, requireAdmin }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If admin route is requested but user is not admin
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // If user route is requested but user is admin
  if (!requireAdmin && user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}; 