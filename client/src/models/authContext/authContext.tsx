import React, {
  createContext,
  useContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import useLocalStorage from '../../hooks/useLocalStorage';

export interface IUser {
  username: string;
}

export interface IAuthContext {
  token: string | null;
  user: IUser | null;
  loadingUser: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('AuthContext must be used within a AuthProvider');
  }

  return context;
};

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);

  const [token, setToken] = useLocalStorage<string | null>('token', null);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!user);

  useEffect(() => {
    setIsAuthenticated(!!user && !!token);
  }, [user, token]);

  const queryResponse = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      if (!token) return null;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL as string}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setToken(null);
          return null;
        }

        return (await response.json()) as IUser;
      } catch (error) {
        setToken(null);
        return null;
      }
    },
    enabled: !!token,
    refetchInterval: 1000,
  });

  useEffect(() => {
    const data: unknown = queryResponse.data;
    if (typeof data !== 'object' || data === null) return;

    if (!('username' in data) || typeof data.username !== 'string') return;
    setUser({ username: data.username });
  }, [queryResponse.data]);

  const authQuery = useCallback(
    async (path: string, username: string, password: string) => {
      const response = await fetch(path, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      const responseJson: unknown = await response.json();
      if (typeof responseJson !== 'object' || responseJson === null) return false;

      if (!('token' in responseJson) || !responseJson.token) return false;
      const responseToken = responseJson.token;

      if (typeof responseToken !== 'string') return false;
      setToken(responseToken);

      return true;
    },
    [setToken],
  );

  const login = useCallback(
    async (username: string, password: string) => {
      return authQuery('/login', username, password);
    },
    [authQuery],
  );

  const register = useCallback(
    async (username: string, password: string) => {
      return authQuery('/register', username, password);
    },
    [authQuery],
  );

  const exposedValues: IAuthContext = {
    token,
    user,
    loadingUser: queryResponse.isLoading,
    isAuthenticated,
    login,
    register,
  };

  return <AuthContext.Provider value={exposedValues}>{children}</AuthContext.Provider>;
};
