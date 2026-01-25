import { Day, EventType } from './enums';

export interface UserRegistration {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserPatches {
  firstName?: string;
  lastName?: string;
}

export interface PatchUserRequest {
  user: UserPatches;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface CreateEvent {
  name: string;
  type: EventType;
  host: string;
  location: string;
  locationLink?: string;
  description: string;
  day: Day;
  startTime: string;
  endTime: string;
  published: boolean;
}

export interface UpdateEvent {
  name?: string;
  type?: EventType;
  host?: string;
  location?: string;
  locationLink?: string;
  description?: string;
  day?: Day;
  startTime?: string;
  endTime?: string;
  published?: boolean;
}

export interface PostAssignmentsRequest {
  assignments: {
    applicantId: string;
    reviewerId: string | undefined;
  }[];
}