import type { ApiResponse, CustomErrorBody, ValidatorError } from '@/lib/types/apiResponses';
import showToast from '@/lib/showToast';
import { AxiosError } from 'axios';
import { ApplicationStatus } from './types/enums';

/**
 * Parse nested error object for messages
 * @param errBody Obj with validator constraint errors
 * @returns List of all user-friendly error strings
 */
export const getMessagesFromError = (errBody: CustomErrorBody): string[] => {
  if (typeof errBody === 'string') return [errBody];
  // if error has no suberrors, just return top level error message
  if (!errBody.errors) return [errBody.message];

  // recursive function to get all error messages into one list
  const getAllErrMessages = (err: ValidatorError): string[] => [
    ...Object.values(err.constraints ?? {}),
    ...err.children.map(child => getAllErrMessages(child)).flat(),
  ];

  return errBody.errors.map(err => getAllErrMessages(err)).flat();
};

/**
 * Extracts a user-friendly error message from an error object.
 *
 * @param error - The error object, which could be of various types (e.g., AxiosError, Error, string, or unknown).
 * @returns A string message describing the error.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError && error.response?.data?.error) {
    const response: ApiResponse = error.response.data;
    return (response.error && getMessagesFromError(response.error).join('\n\n')) || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error';
}

/**
 * Displays an error message to the user using a toast notification.
 *
 * @param title - The title of the error message.
 * @param error - The error object to be processed and displayed.
 */
export function reportError(title: string, error: unknown) {
  showToast(title, getErrorMessage(error));
}

export function canUserSubmitWaivers(applicationStatus: ApplicationStatus): boolean {
  return (
    applicationStatus === ApplicationStatus.ACCEPTED ||
    applicationStatus === ApplicationStatus.CONFIRMED
  );
}
