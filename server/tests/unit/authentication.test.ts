import { BadRequestError, UnauthorizedError } from 'routing-controllers';
import type { NextFunction, Request, Response } from 'express';
import { UserAuthentication } from '../../api/middleware/UserAuthentication';
import type { UserService } from '../../services/UserService';

describe('When a request has no authorization header', () => {
  test('Then, an unauthorized error is passed to the next handler', async () => {
    const next = jest.fn() as NextFunction;
    jest.spyOn(console, 'error').mockImplementation();
    const middleware = new UserAuthentication({} as UserService);

    await middleware.use(
      { get: jest.fn().mockReturnValue(undefined) } as unknown as Request,
      {} as Response,
      next,
    );

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });
});

describe('When a request has a malformed authorization header', () => {
  test('Then, a bad request error is passed to the next handler', async () => {
    const next = jest.fn() as NextFunction;
    jest.spyOn(console, 'error').mockImplementation();
    const middleware = new UserAuthentication({} as UserService);

    await middleware.use(
      { get: jest.fn().mockReturnValue('Basic token') } as unknown as Request,
      {} as Response,
      next,
    );

    expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
  });
});
