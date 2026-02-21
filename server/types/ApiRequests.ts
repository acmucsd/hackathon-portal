import { UserModel } from '../models/UserModel';
import { ApplicationDecision, Day, EventType } from './Enums';

declare global {
  namespace Express {
    interface Request {
      user?: UserModel;
    }
  }
}

export type File = Express.Multer.File;

export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CreateUserRequest {
  user: CreateUser;
}

export interface UpdateUser {
  firstName?: string;
  lastName?: string;
}

export interface UpdateUserRequest {
  user: UpdateUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Event requests
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

export interface CreateEventRequest {
  event: CreateEvent;
}

export interface UpdateEventRequest {
  event: UpdateEvent;
}

// Admin requests
export interface UpdateApplicationDecisionRequest {
  applicationDecision: ApplicationDecision;
  reviewerComments?: string | null;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ReviewAssignmentJob {
  applicantId: string;
  reviewerId: string | undefined;
}

export interface PostAssignmentsRequest {
  assignments: ReviewAssignmentJob[];
}

//InterestForm request
export interface AddInterestedEmailRequest {
  email: string;
}
export interface RemoveInterestedEmailRequest {
  email: string;
}
export interface AddListOfInterestedEmailRequest {
  emails: string[];
}
