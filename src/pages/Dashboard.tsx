import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import LoadingScreen from '@/components/layout/LoadingScreen';

export default function Dashboard() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // If user is admin, redirect them to the admin dashboard
  if (role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <StudentDashboard />;
}
