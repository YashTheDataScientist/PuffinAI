// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('authenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
}

export default ProtectedRoute;
