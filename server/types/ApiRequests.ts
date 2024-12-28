import { UserModel } from '../models/UserModel';

declare global {
  namespace Express {
    interface Request {
      user?: UserModel;
    }
  }
}

export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CreateUserRequest {
  user: CreateUser;
}
