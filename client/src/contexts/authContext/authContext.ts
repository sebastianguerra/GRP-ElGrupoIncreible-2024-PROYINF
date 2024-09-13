import { createContext } from 'react';

export interface IUser {
  username: string;
}

export interface IAuthContext {
  token: string | null;
  user: IUser | null;
  loadingUser: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<string | null>;
  register: (username: string, password: string) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export default AuthContext;
