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
import axios from 'axios';

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
  const authURL = (import.meta.env.VITE_API_URL as string | undefined) ?? '';
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

      const response = await axios.get(`${authURL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data: unknown = response.data;

      if (typeof data !== 'object' || data === null) return null;
      if (!('username' in data) || typeof data.username !== 'string') return null;

      const result: IUser = {
        username: data.username,
      };
      return result;
    },
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

  const authQuery = useCallback(
    async (path: string, username: string, password: string) => {
      const response = await axios.post(`${authURL}${path}`, {
        username,
        password,
      });
      const data: unknown = response.data;

      if (typeof data !== 'object' || data === null) return false;

      if (!('token' in data) || !data.token) return false;
      const responseToken = data.token;

      if (typeof responseToken !== 'string') return false;
      setToken(responseToken);

      return true;
    },
    [setToken, authURL],
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
