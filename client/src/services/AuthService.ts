import axios from 'axios';
import { Err, Ok, Result } from 'ts-results';

import { getErrorMessage, getStatusMessage } from '@/helpers/errors';
import { hasValidToken, isValidUser } from '@/helpers/validators/auth';
import { IUser, JWT } from '@/types/auth';

const authURL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001';

function validateResponseStatus<S extends readonly number[]>(
  status: number,
  allowedStatuses: S,
): asserts status is S[number] {
  if (!allowedStatuses.includes(status)) throw new Error(getStatusMessage(status));
}

export async function me(token: JWT): Promise<Result<IUser, string>> {
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.get(`${authURL}/me`, { headers });

    validateResponseStatus(response.status, [200] as const);

    const data: unknown = response.data;
    return isValidUser(data) ? Ok(data) : Err('Invalid user');
  } catch (error: unknown) {
    return Err(getErrorMessage(error));
  }
}

async function authQuery(
  path: string,
  username: string,
  password: string,
): Promise<Result<JWT, string>> {
  try {
    const body = { username, password };
    const response = await axios.post(`${authURL}${path}`, body);

    validateResponseStatus(response.status, [200, 201] as const);

    const data: unknown = response.data;
    return hasValidToken(data) ? Ok(data.token) : Err('Invalid token');
  } catch (error: unknown) {
    return Err(getErrorMessage(error));
  }
}

export function login(username: string, password: string) {
  return authQuery('/login', username, password);
}

export function register(username: string, password: string) {
  return authQuery('/register', username, password);
}

export default {
  me,
  login,
  register,
};
