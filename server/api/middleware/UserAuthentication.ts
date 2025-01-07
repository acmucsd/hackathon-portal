import {
  BadRequestError,
  ExpressMiddlewareInterface,
  UnauthorizedError,
} from 'routing-controllers';
import { Service } from 'typedi';
import { UserService } from '../../services/UserService';
import { NextFunction, Request, Response } from 'express';

@Service()
export class UserAuthentication implements ExpressMiddlewareInterface {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async use(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.get('Authorization');
    if (!authHeader) throw new UnauthorizedError('Missing auth token');
    const splitHeader = authHeader.split(' ');
    const invalidAuthFormat =
      splitHeader.length !== 2 ||
      splitHeader[0] !== 'Bearer' ||
      splitHeader[1].length === 0;
    if (invalidAuthFormat) throw new BadRequestError();
    const token = splitHeader[1];
    request.user = await this.userService.checkAuthToken(token);
    return next();
  }
}
