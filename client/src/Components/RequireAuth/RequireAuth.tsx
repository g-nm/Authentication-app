import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { user } = useAuth();
  if (!user) {
    return (
      <Navigate to={'/login'} state={{ from: location.pathname }} replace />
    );
  }

  return <>{children}</>;
};
export default RequireAuth;
