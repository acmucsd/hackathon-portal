import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserRequest } from '../../api/validators/UserControllerRequests';

describe('When a user registration email is outside an allowed education domain', () => {
  test('Then, validation rejects the request', async () => {
    const request = plainToInstance(CreateUserRequest, {
      user: {
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        password: 'password123',
      },
    });

    const errors = await validate(request);

    expect(errors[0].children?.[0].property).toBe('email');
  });
});
