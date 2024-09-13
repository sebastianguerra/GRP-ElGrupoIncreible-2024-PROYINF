import { PropsWithChildren, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import useLocalStorage from '../../hooks/useLocalStorage';
import AuthService from '../../services/AuthService';

import AuthContext, { IAuthContext } from './authContext';

function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useLocalStorage<string | null>('token', null);

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: () => AuthService.me(token).then((r) => r.unwrapOr(undefined)),
    enabled: !!token,
    refetchInterval: 1000,
  });

  const login = useCallback(
    (username: string, password: string) =>
      AuthService.login(username, password).then((t) => {
        setToken(t.unwrapOr(null));
        return t;
      }),
    [setToken],
  );

  const register = useCallback(
    (username: string, password: string) =>
      AuthService.register(username, password).then((t) => {
        setToken(t.unwrapOr(null));
        return t;
      }),
    [setToken],
  );

  const logout = useCallback(() => {
    setToken(null);
  }, [setToken]);

  const exposedValues: IAuthContext = {
    token,
    user: user,
    loadingUser,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={exposedValues}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
