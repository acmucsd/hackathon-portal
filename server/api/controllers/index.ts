import { UserController } from './UserController';
import { UserModel } from '../../models/UserModel';
import { AuthController } from './AuthController';

export const controllers = [AuthController, UserController];

// this merges our custom properties into Express's Request type
declare global {
  namespace Express {
    interface Request {
      user?: UserModel;
      trace?: string;
    }
  }
}