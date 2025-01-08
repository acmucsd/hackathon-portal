import { Request, Response, NextFunction } from 'express';
import {
  ExpressErrorMiddlewareInterface,
  HttpError,
  Middleware,
} from 'routing-controllers';
import { ApiResponse, CustomErrorBody } from '../../types/ApiResponses';
import { Config } from '../../config';
import { Service } from 'typedi';

@Middleware({ type: 'after' })
@Service()
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction,
  ): void {
    if (!response.headersSent) {
      console.error(error);
      const { name, message, stack } = error;
      const httpCode = error instanceof HttpError ? error.httpCode : 500;
      const errorBody: CustomErrorBody = {
        ...error, // in case a library throws its own error (e.g. class-validator)
        name,
        message,
        httpCode,
      };
      if (Config.isDevelopment) {
        errorBody.stack = stack;
      }
      const errorResponse: ApiResponse = { error: errorBody };
      response.status(httpCode).json(errorResponse);
    } else {
      next();
    }
  }
}
