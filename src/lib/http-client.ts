import ky, { isHTTPError, isNetworkError, isTimeoutError, SchemaValidationError } from 'ky';
import { env } from '@/config/env';

export const getErrorMessage = (error: Error): string => {
  if (isHTTPError(error)) {
    if (error.response?.status === 404) {
      return 'Requested URL is not available. Please try again.';
    }
    return `Server error (${error.response?.status}). Please try again.`;
  }

  if (isNetworkError(error)) {
    return 'Unable to connect to the server. Please check your connection and try again.';
  }

  if (isTimeoutError(error)) {
    return 'The request timed out. Please try again.';
  }

  if (error instanceof SchemaValidationError) {
    return 'Unexpected API response format. Please try again later.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

const http = ky.create({
  baseUrl: env.apiBaseUrl,
  retry: 0,
});

export { http };
