import { statusCodeToMessage } from './constants';

export function getErrorMessage(error: unknown, defaultMsg = 'Unknown Error'): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return defaultMsg;
}

export function getStatusMessage(status: number, defaultMsg = 'Unknown Error'): string {
  return statusCodeToMessage[status] ?? defaultMsg;
}
