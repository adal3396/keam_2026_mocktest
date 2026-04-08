import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import LandingPage from '@/components/landing/LandingPage';

import LoadingScreen from '@/components/layout/LoadingScreen';

export default function Index() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <LoadingScreen fullScreen={true} />;
  }

  if (user) {
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return <LandingPage />;
}
