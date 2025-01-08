import { ResponseModel } from '../models/ResponseModel';
import { ApplicationStatus, UserAccessType } from './Enums';

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
}

export interface ApiResponse {
  error: any;
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
  responses: ResponseModel[]
}

export interface GetFormResponse extends ApiResponse {
  response: ResponseModel;
}

export interface SubmitApplicationResponse extends ApiResponse {
  response: ResponseModel;
}

export interface DeleteApplicationResponse extends ApiResponse {}