import axios from 'axios';
import { Err, Ok, Result } from 'ts-results';

import { hasProperty } from '@/helpers/objects';
import { IUser, JWT } from '@/types/auth';

const authURL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001';

export async function me(token: JWT | null): Promise<Result<IUser, string>> {
  if (!token) return Err('No token');
  try {
    const response = await axios.get(`${authURL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: unknown = response.data;

    if (!hasProperty(data, 'username')) return Err('Invalid username');
    if (typeof data.username !== 'string') return Err('Invalid username');

    return Ok({
      username: data.username,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Err(error.message);
    }
    if (typeof error === 'string') {
      return Err(error);
    }
    return Err('Unknown error');
  }
}

async function authQuery(
  path: string,
  username: string,
  password: string,
): Promise<Result<JWT, string>> {
  try {
    const response = await axios.post(`${authURL}${path}`, {
      username,
      password,
    });
    if (response.status >= 300 || response.status < 200) {
      switch (response.status) {
        case 401:
          return Err('Unauthorized');
        case 403:
          return Err('Forbidden');
        case 404:
          return Err('Not Found');
        case 500:
          return Err('Internal Server Error');
        default:
          return Err('Unknown Error');
      }
    }
    const data: unknown = response.data;

    if (!hasProperty(data, 'token')) return Err('Invalid response');
    const responseToken = data.token;

    if (typeof responseToken !== 'string') return Err('Invalid token type');

    return Ok(responseToken as JWT);
  } catch (error: unknown) {
    if (error instanceof Error) {
      const message = error.message;
      if (message.includes('401')) {
        return Err('Unauthorized');
      }
      if (message.includes('403')) {
        return Err('Forbidden');
      }
      if (message.includes('404')) {
        return Err('Not Found');
      }
      return Err(message);
    }
    if (typeof error === 'string') {
      return Err(error);
    }
    return Err('Unknown error');
  }
}

export async function login(username: string, password: string): Promise<Result<JWT, string>> {
  return authQuery('/login', username, password);
}

export async function register(username: string, password: string): Promise<Result<JWT, string>> {
  return authQuery('/register', username, password);
}

export default {
  me,
  login,
  register,
};
