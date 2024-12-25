import { ExpressMiddlewareInterface, ForbiddenError } from 'routing-controllers';
import * as express from 'express';
import { Inject } from 'typedi';
import { authAdmin } from '../services/FirebaseService';
import { UserService } from '../services/UserService';

export class UserAuthentication implements ExpressMiddlewareInterface {
  @Inject()
  private userService: UserService;

  async use(request: express.Request, response: express.Response, next?: express.NextFunction) {
    console.log("middleware userauth");
    const authHeader = request.headers.authorization;
    const token = authHeader?.split('Bearer ')[1];

    if (!token) {
      throw new ForbiddenError('Missing or invalid authorization token');
    }
    try {
      const decodedToken = await authAdmin.verifyIdToken(token);
      const user = await this.userService.findByUid(decodedToken.uid);

      if (!user) {
        throw new ForbiddenError('User not found');
      }

      request.user = user;
      console.log("user: ", user);
      if (next) {
        return next();
      }

    } catch (error) {
      throw new ForbiddenError('Invalid or expired Firebase token');
    }

  }
}
