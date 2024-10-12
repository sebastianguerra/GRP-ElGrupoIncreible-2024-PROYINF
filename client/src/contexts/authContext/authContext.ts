import { createContext } from 'react';
import { Result } from 'ts-results';

import { IUser, JWT } from '@/types/auth';

export interface IAuthContext {
  token: JWT | null;
  user: IUser | undefined;
  loadingUser: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<Result<JWT, string>>;
  register: (username: string, password: string) => Promise<Result<JWT, string>>;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export default AuthContext;
