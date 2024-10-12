import { Branded } from './branded';

export interface IUser {
  username: string;
}

export type JWT = Branded<string, 'JWT'>;
