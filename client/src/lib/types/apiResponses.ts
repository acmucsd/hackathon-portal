import { ApplicationStatus, UserAccessType } from './enums';

// User
// Pulled from server/types/ApiResponses.ts

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
}

export interface GetCurrentUserResponse extends ApiResponse {
  user: PrivateProfile;
}

export interface PatchUserResponse extends ApiResponse {
  user: PrivateProfile;
}

// Auth

export interface ApiResponse {
  error: any;
}

export interface RegistrationResponse extends ApiResponse {
  user: PrivateProfile;
}

export interface LoginResponse extends ApiResponse {
  token: string;
  user: PrivateProfile;
}

// Response types

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
