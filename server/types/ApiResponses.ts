import { ApplicationStatus, UserAccessType } from './Enums';

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

// Firebase Responses
export interface GetIdTokenResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface SendEmailVerificationResponse {
  email: string;
}
