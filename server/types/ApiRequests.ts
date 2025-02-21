import { UserModel } from '../models/UserModel';
import { ApplicationDecision } from './Enums';

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

// Admin requests
export interface UpdateApplicationDecisionRequest {
  applicationDecision: ApplicationDecision;
}

export interface ForgotPasswordRequest {
  email: string;
}
