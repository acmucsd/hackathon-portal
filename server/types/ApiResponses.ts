import { ResponseModel } from '../models/ResponseModel';
import {
  ApplicationStatus,
  ApplicationDecision,
  UserAccessType,
  EventType,
  Day,
} from './Enums';

// User responses
export interface PublicProfile {
  id: string;
  firstName: string;
  lastName: string;
}

export interface PrivateProfile extends PublicProfile {
  email: string;
  accessType: UserAccessType;
  applicationStatus: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
  responses?: ResponseModel;
}

export interface HiddenProfile extends PrivateProfile {
  applicationDecision: ApplicationDecision;
}

export interface CustomErrorBody {
  name: string;
  message: string;
  httpCode: number;
  stack?: string;
  errors?: any;
}

export interface ApiResponse {
  error: CustomErrorBody | null;
}

export interface CreateUserResponse extends ApiResponse {
  user: PrivateProfile;
}

export interface GetUserResponse extends ApiResponse {
  user: PublicProfile;
}

export interface GetCurrentUserResponse extends ApiResponse {
  user: PrivateProfile;
}

export interface UpdateCurrentUserReponse extends ApiResponse {
  user: PrivateProfile;
}

export interface DeleteCurrentUserResponse extends ApiResponse {}

export interface UserAndToken {
  token: string;
  user: PrivateProfile;
}

export interface LoginResponse extends ApiResponse {
  token: string;
  user: PrivateProfile;
}

// Form response responses
export interface GetFormsResponse extends ApiResponse {
  responses: ResponseModel[];
}

export interface GetFormResponse extends ApiResponse {
  response: ResponseModel;
}

export interface SubmitApplicationResponse extends ApiResponse {
  response: ResponseModel;
}

export interface DeleteApplicationResponse extends ApiResponse {}

// Event responses
export interface PublicEvent {
  uuid: string;
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

export interface CreateEventResponse extends ApiResponse {
  event: PublicEvent;
}

export interface GetAllEventsResponse extends ApiResponse {
  events: PublicEvent[];
}

export interface GetPublishedEventsResponse extends ApiResponse {
  events: PublicEvent[];
}

export interface GetOneEventResponse extends ApiResponse {
  event: PublicEvent;
}

export interface UpdateEventResponse extends ApiResponse {
  event: PublicEvent;
}

export interface DeleteEventResponse extends ApiResponse {}

// Admin responses
export interface GetApplicationDecisionResponse extends ApiResponse {
  user: HiddenProfile;
}

export interface UpdateApplicationDecisionResponse extends ApiResponse {
  user: HiddenProfile;
}

export interface ForgotPasswordResponse extends ApiResponse {}

export interface PublicAttendance {
  user: PublicProfile;
  event: PublicEvent;
  timestamp: Date;
}

export interface AttendEventResponse extends ApiResponse {
  event: PublicEvent;
}

export interface ReviewAssignment {
  applicant: HiddenProfile;
  reviewer: HiddenProfile | undefined;
}

export interface PostAssignmentsResponse extends ApiResponse {
  newAssignments: ReviewAssignment[];
}

export interface GetAssignmentsResponse extends ApiResponse {
  assignments: ReviewAssignment[];
}