import { useContext } from 'react';
import AuthContext from './authContext';

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('AuthContext must be used within a AuthProvider');
  }

  return context;
};

export default useAuth;
