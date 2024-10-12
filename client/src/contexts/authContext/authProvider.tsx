import { useQuery } from '@tanstack/react-query';
import { PropsWithChildren, useCallback } from 'react';

import useLocalStorage from '@/hooks/useLocalStorage';
import AuthService from '@/services/AuthService';

import AuthContext, { IAuthContext } from './authContext';

function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useLocalStorage<string | null>('token', null);

  const {
    data: user,
    isLoading: loadingUser,
    isError,
  } = useQuery({
    queryKey: ['user', token],
    queryFn: () => AuthService.me(token),
    select: (data) => data.unwrap(),
    enabled: !!token,
    refetchInterval: 1000,
    retry: 3,
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
    isAuthenticated: !!user && !!token && !isError,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={exposedValues}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
