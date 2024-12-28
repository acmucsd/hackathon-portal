import {
  ExpressMiddlewareInterface,
  ForbiddenError,
} from 'routing-controllers';
import { Inject } from 'typedi';
import { UserService } from '../../services/UserService';
import { NextFunction, Request, Response } from 'express';

export class UserAuthentication implements ExpressMiddlewareInterface {
  @Inject()
  private userService: UserService;

  async use(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.get('Authorization');
    if (!authHeader) throw new ForbiddenError('Missing auth token');
    const splitHeader = authHeader.split(' ');
    const invalidAuthFormat =
      splitHeader.length !== 2 ||
      splitHeader[0] !== 'Bearer' ||
      splitHeader[1].length === 0;
    if (invalidAuthFormat) throw new ForbiddenError();
    const token = splitHeader[1];
    request.user = await this.userService.checkAuthToken(token);
    return next();
  }
}
