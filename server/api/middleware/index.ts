import { NextFunction, Request, Response } from 'express';
import { UserAuthentication } from './UserAuthentication';

export const middlewares = [UserAuthentication];

export function errorHandler(
  error: any,
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  if (response.headersSent) {
    next();
  } else {
    console.error(error);
    response.status(error.httpCode || 500).json({ error: error.message });
  }
}