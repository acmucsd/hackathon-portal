import { Application } from './application';
import {
  ApplicationStatus,
  ApplicationDecision,
  FormType,
  UserAccessType,
  Day,
  EventType,
} from './enums';

export interface ResponseModel {
  uuid: string;
  user: PrivateProfile;
  createdAt: string;
  updatedAt: string;
  formType: FormType;
  data: Application;
}

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

export interface FullProfile extends PrivateProfile {
  applicationDecision: ApplicationDecision;
  reviewerComments: string | null;
}

export interface ValidatorError {
  children: ValidatorError[];
  constraints: object;
  property: string;
  target: object;
}

export interface CustomErrorBody {
  name: string;
  message: string;
  httpCode: number;
  stack?: string;
  errors?: ValidatorError[];
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

// Firebase Responses
export interface GetIdTokenResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface SendEmailVerificationResponse {
  email: string;
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

// Admin FormResponses

export interface GetApplicationsResponse extends ApiResponse {
  responses: ResponseModel[];
}

export interface GetApplicationResponse extends ApiResponse {
  response: ResponseModel;
}

// Admin User Responses
export interface GetUsersResponse extends ApiResponse {
  users: FullProfile[];
}

export interface GetUserApplicationResponse extends ApiResponse {
  application: ResponseModel;
}

export interface ForgotPasswordResponse extends ApiResponse {}

// Admin Application Decision Responses

export interface GetApplicationDecisionResponse extends ApiResponse {
  user: FullProfile;
}

export interface UpdateApplicationDecisionResponse extends ApiResponse {
  user: FullProfile;
}

// Event Responses

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
export interface ConfirmUserStatusResponse extends ApiResponse {
  user: FullProfile;
}

export interface DeleteEventResponse extends ApiResponse {}

// Admin responses
export interface GetApplicationDecisionResponse extends ApiResponse {
  user: FullProfile;
}

export interface UpdateApplicationDecisionResponse extends ApiResponse {
  user: FullProfile;
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

export interface GetEmailVerificationLinkResponse extends ApiResponse {
  emailVerificationLink: string;
}

// Assignment Responses

export interface ReviewAssignment {
  applicant: FullProfile;
  reviewer: FullProfile | undefined;
}

export interface PostAssignmentsResponse extends ApiResponse {
  newAssignments: ReviewAssignment[];
}

export interface GetAssignmentsResponse extends ApiResponse {
  assignments: ReviewAssignment[];
}