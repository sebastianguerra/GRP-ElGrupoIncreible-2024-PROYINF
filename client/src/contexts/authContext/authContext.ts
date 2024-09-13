import { createContext } from 'react';
import { Result } from 'ts-results';

import { IUser } from '@/services/AuthService';

export interface IAuthContext {
  token: string | null;
  user: IUser | undefined;
  loadingUser: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<Result<string, string>>;
  register: (username: string, password: string) => Promise<Result<string, string>>;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export default AuthContext;
