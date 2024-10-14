import { hasProperty } from '@/helpers/objects';
import { IUser } from '@/types/auth';

export function isValidUser(user: unknown): user is IUser {
  return hasProperty(user, 'username') && typeof user.username === 'string';
}
