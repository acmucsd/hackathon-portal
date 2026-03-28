import type {
  ApiResponse,
  CustomErrorBody,
  ValidatorError,
  RevieweeProfile,
} from '@/lib/types/apiResponses';
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

/**
 * Formats message into title case
 *
 * @param message - Message to be formatted
 */
export function formatTitleCase(message: string) {
  return message
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Formats military time to 12-hour time
 *
 * @param time - Time to be formatted
 */
export function formatTime(time: string) {
  const [hours, minutes] = time.split(':').map(Number);

  const period = hours >= 12 ? 'PM' : 'AM';
  const adjustedHours = hours % 12 || 12;
  const formattedTime = `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${period}`;

  return formattedTime;
}

export function canUserSubmitWaivers(applicationStatus: ApplicationStatus): boolean {
  return (
    applicationStatus === ApplicationStatus.ACCEPTED ||
    applicationStatus === ApplicationStatus.ACCEPTED_FROM_WAITLIST ||
    applicationStatus === ApplicationStatus.CONFIRMED
  );
}

/**
 * Format a date-like value in Pacific time (PST/PDT depending on DST).
 *
 * @param value - Date object or date string
 * @param includeDate - Whether to include MM/DD/YYYY
 * @returns Formatted timestamp or null when input is invalid
 */
export function formatPacificDateTime(value: string | Date, includeDate = true): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    ...(includeDate
      ? {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        }
      : {}),
  }).format(date);
}

/**
 * Format a date-like value using 24-hour (military) time in local timezone.
 *
 * @param value - Date object or date string
 * @param includeDate - Whether to include MM/DD/YYYY
 * @returns Formatted timestamp or null when input is invalid
 */
export function formatMilitaryDateTime(value: string | Date, includeDate = true): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    ...(includeDate
      ? {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        }
      : {}),
  }).format(date);
}

/**
 * Parses a date-like value into a numeric timestamp for sorting.
 * Returns POSITIVE_INFINITY for missing or invalid values so they sort to the end.
 *
 * @param value - Date object or date string
 */
function parseCreatedAt(value?: string | Date): number {
  if (!value) return Number.POSITIVE_INFINITY;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
}

/**
 * Sorts RevieweeProfile objects by createdAt ascending, then last name, first name, and id.
 *
 * @param a - First profile to compare
 * @param b - Second profile to compare
 */
export function sortRevieweeProfiles(a: RevieweeProfile, b: RevieweeProfile): number {
  const createdAtDiff = parseCreatedAt(a.createdAt) - parseCreatedAt(b.createdAt);
  if (createdAtDiff !== 0) return createdAtDiff;
  const lastNameDiff = a.lastName.localeCompare(b.lastName, undefined, { sensitivity: 'base' });
  if (lastNameDiff !== 0) return lastNameDiff;
  const firstNameDiff = a.firstName.localeCompare(b.firstName, undefined, { sensitivity: 'base' });
  if (firstNameDiff !== 0) return firstNameDiff;
  return a.id.localeCompare(b.id);
}

const DECISION_STATUS_LABELS: Record<string, string> = {
  ACCEPT: 'ACCEPTED',
  REJECT: 'REJECTED',
  WAITLIST: 'WAITLISTED',
  NO_DECISION: 'NO_DECISION',
};

/**
 * Filters a list of RevieweeProfiles by application status/decision and name search query.
 *
 * @param users - List of profiles to filter
 * @param status - Application status or decision label to filter by (e.g. 'SUBMITTED', 'ACCEPTED'). Pass 'All' or omit to skip status filtering.
 * @param query - Name search string. Omit or pass empty string to skip.
 */
export function filterApplicantsByCriteria(
  users: RevieweeProfile[],
  status?: string,
  query?: string
): RevieweeProfile[] {
  return users
    .filter(user => {
      if (!status || status === 'All') return true;
      return (
        user.applicationStatus === status ||
        DECISION_STATUS_LABELS[user.applicationDecision] === status
      );
    })
    .filter(
      user =>
        !query || `${user.firstName} ${user.lastName}`.toLowerCase().includes(query.toLowerCase())
    );
}
