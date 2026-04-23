import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  // Check if admin-only route and user is not admin
  if (adminOnly && user?.role !== 'admin') {
    console.warn('🚫 Access denied: Admin role required')
    return <Navigate to="/" replace />
  }

  return children
}