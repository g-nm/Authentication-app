import { useContext } from 'react';
import { AuthContext } from '../Components/AuthService/AuthService';

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
