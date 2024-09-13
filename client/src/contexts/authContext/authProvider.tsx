import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import useLocalStorage from '../../hooks/useLocalStorage';
import AuthService, { IUser } from '../../services/AuthService';

import AuthContext, { IAuthContext } from './authContext';

function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<IUser | null>(null);

  const [token, setToken] = useLocalStorage<string | null>('token', null);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!user);

  useEffect(() => {
    setIsAuthenticated(!!user && !!token);
  }, [user, token]);

  const queryResponse = useQuery({
    queryKey: ['user'],
    queryFn: () => AuthService.me(token).then((r) => r.unwrapOr(null)),
    enabled: !!token,
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (!queryResponse.data) {
      setUser(null);
      return;
    }

    setUser({ username: queryResponse.data.username });
  }, [queryResponse.data]);

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
    user,
    loadingUser: queryResponse.isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={exposedValues}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
