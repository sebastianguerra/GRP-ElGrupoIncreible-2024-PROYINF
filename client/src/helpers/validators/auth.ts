import { hasProperty } from '@/helpers/objects';
import { IUser, JWT } from '@/types/auth';

export function isValidUser(user: unknown): user is IUser {
  return hasProperty(user, 'username') && typeof user.username === 'string';
}

export function isValidToken(token: unknown): token is JWT {
  return typeof token === 'string';
}

export function hasValidToken(data: unknown): data is { token: JWT } {
  return hasProperty(data, 'token') && isValidToken(data.token);
}
