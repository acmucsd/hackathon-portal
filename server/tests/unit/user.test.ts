import { UserController } from '../../api/controllers/UserController';
import { IdParam } from '../../api/validators/GenericRequests';
import {
  CreateUserRequest,
  UpdateFetchAiHandleRequest,
  UpdateUserRequest,
  VerifyTokenRequest,
} from '../../api/validators/UserControllerRequests';
import { UserModel } from '../../models/UserModel';
import type { UserService } from '../../services/UserService';
import { ApplicationStatus, House, UserAccessType } from '../../types/Enums';

describe('When a user is created', () => {
  test('Then, the private user profile is returned', async () => {
    const createdUser = new UserModel();
    createdUser.id = 'user-1';
    createdUser.firstName = 'Ada';
    createdUser.lastName = 'Lovelace';
    createdUser.house = House.UNASSIGNED;
    createdUser.points = 0;
    createdUser.email = 'ada@ucsd.edu';
    createdUser.accessType = UserAccessType.STANDARD;
    createdUser.applicationStatus = ApplicationStatus.NOT_SUBMITTED;
    createdUser.createdAt = new Date('2026-01-01T00:00:00.000Z');
    createdUser.updatedAt = new Date('2026-01-02T00:00:00.000Z');
    createdUser.fetchAiHandle = null;

    const controller = new UserController({
      createUser: jest.fn().mockResolvedValue(createdUser),
    } as unknown as UserService);

    const result = await controller.createUser({
      user: {
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@ucsd.edu',
        password: 'password123',
      },
    } as CreateUserRequest);

    expect(result).toEqual({
      error: null,
      user: {
        id: 'user-1',
        firstName: 'Ada',
        lastName: 'Lovelace',
        house: House.UNASSIGNED,
        points: 0,
        email: 'ada@ucsd.edu',
        accessType: UserAccessType.STANDARD,
        applicationStatus: ApplicationStatus.NOT_SUBMITTED,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
        fetchAiHandle: null,
      },
    });
  });
});

describe('When a client verifies an auth token', () => {
  test('Then, the private user profile is returned', async () => {
    const verifiedUser = Object.assign(new UserModel(), {
      id: 'user-1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      house: House.UNASSIGNED,
      points: 0,
      email: 'ada@ucsd.edu',
      accessType: UserAccessType.STANDARD,
      applicationStatus: ApplicationStatus.NOT_SUBMITTED,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      fetchAiHandle: null,
    });
    const checkAuthToken = jest.fn().mockResolvedValue(verifiedUser);

    const controller = new UserController({
      checkAuthToken,
    } as unknown as UserService);

    const result = await controller.verifyToken({ token: 'token-1' } as VerifyTokenRequest);

    expect(result).toEqual({
      error: null,
      user: verifiedUser.getPrivateProfile(),
    });
    expect(checkAuthToken).toHaveBeenCalledWith('token-1');
  });
});

describe('When a user requests their own public profile', () => {
  test('Then, the public user profile is returned', async () => {
    const currentUser = new UserModel();
    currentUser.id = 'user-1';
    currentUser.firstName = 'Ada';
    currentUser.lastName = 'Lovelace';
    currentUser.house = House.UNASSIGNED;
    currentUser.points = 0;

    const controller = new UserController({} as UserService);

    const result = await controller.getUser(
      { id: 'user-1' } as IdParam,
      currentUser,
    );

    expect(result).toEqual({
      error: null,
      user: {
        id: 'user-1',
        firstName: 'Ada',
        lastName: 'Lovelace',
        house: House.UNASSIGNED,
        points: 0,
      },
    });
  });
});

describe('When a user requests another user public profile', () => {
  test('Then, the public user profile is returned', async () => {
    const currentUser = new UserModel();
    currentUser.id = 'current-user';

    const otherUser = new UserModel();
    otherUser.id = 'user-1';
    otherUser.firstName = 'Ada';
    otherUser.lastName = 'Lovelace';
    otherUser.house = House.UNASSIGNED;
    otherUser.points = 0;
    otherUser.email = 'ada@ucsd.edu';
    otherUser.accessType = UserAccessType.ADMIN;
    otherUser.applicationStatus = ApplicationStatus.SUBMITTED;

    const controller = new UserController({
      findById: jest.fn().mockResolvedValue(otherUser),
    } as unknown as UserService);

    const result = await controller.getUser(
      { id: 'user-1' } as IdParam,
      currentUser,
    );

    expect(result).toStrictEqual({
      error: null,
      user: {
        id: 'user-1',
        firstName: 'Ada',
        lastName: 'Lovelace',
        house: House.UNASSIGNED,
        points: 0,
      },
    });
  });
});

describe('When a user requests their current user profile', () => {
  test('Then, the private user profile is returned', async () => {
    const currentUser = new UserModel();
    currentUser.id = 'user-1';
    currentUser.firstName = 'Ada';
    currentUser.lastName = 'Lovelace';
    currentUser.house = House.UNASSIGNED;
    currentUser.points = 0;
    currentUser.email = 'ada@ucsd.edu';
    currentUser.accessType = UserAccessType.STANDARD;
    currentUser.applicationStatus = ApplicationStatus.NOT_SUBMITTED;
    currentUser.createdAt = new Date('2026-01-01T00:00:00.000Z');
    currentUser.updatedAt = new Date('2026-01-02T00:00:00.000Z');
    currentUser.fetchAiHandle = null;

    const controller = new UserController({} as UserService);

    const result = await controller.getCurrentUser(currentUser);

    expect(result).toEqual({
      error: null,
      user: {
        id: 'user-1',
        firstName: 'Ada',
        lastName: 'Lovelace',
        house: House.UNASSIGNED,
        points: 0,
        email: 'ada@ucsd.edu',
        accessType: UserAccessType.STANDARD,
        applicationStatus: ApplicationStatus.NOT_SUBMITTED,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
        fetchAiHandle: null,
      },
    });
  });
});

describe('When a user updates their profile', () => {
  test('Then, the updated private user profile is returned', async () => {
    const currentUser = new UserModel();
    currentUser.id = 'user-1';

    const updatedUser = new UserModel();
    updatedUser.id = 'user-1';
    updatedUser.firstName = 'Ada';
    updatedUser.lastName = 'Byron';
    updatedUser.house = House.UNASSIGNED;
    updatedUser.points = 0;
    updatedUser.email = 'ada@ucsd.edu';
    updatedUser.accessType = UserAccessType.STANDARD;
    updatedUser.applicationStatus = ApplicationStatus.NOT_SUBMITTED;
    updatedUser.createdAt = new Date('2026-01-01T00:00:00.000Z');
    updatedUser.updatedAt = new Date('2026-01-02T00:00:00.000Z');
    updatedUser.fetchAiHandle = null;

    const controller = new UserController({
      updateUser: jest.fn().mockResolvedValue(updatedUser),
    } as unknown as UserService);

    const result = await controller.updateCurrentUser(
      { user: { lastName: 'Byron' } } as UpdateUserRequest,
      currentUser,
    );

    expect(result).toEqual({
      error: null,
      user: {
        id: 'user-1',
        firstName: 'Ada',
        lastName: 'Byron',
        house: House.UNASSIGNED,
        points: 0,
        email: 'ada@ucsd.edu',
        accessType: UserAccessType.STANDARD,
        applicationStatus: ApplicationStatus.NOT_SUBMITTED,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
        fetchAiHandle: null,
      },
    });
  });
});

describe('When a user updates their Fetch AI handle', () => {
  test('Then, the updated private user profile is returned', async () => {
    const currentUser = new UserModel();
    currentUser.id = 'user-1';

    const updatedUser = new UserModel();
    updatedUser.id = 'user-1';
    updatedUser.firstName = 'Ada';
    updatedUser.lastName = 'Lovelace';
    updatedUser.house = House.UNASSIGNED;
    updatedUser.points = 0;
    updatedUser.email = 'ada@ucsd.edu';
    updatedUser.accessType = UserAccessType.STANDARD;
    updatedUser.applicationStatus = ApplicationStatus.NOT_SUBMITTED;
    updatedUser.createdAt = new Date('2026-01-01T00:00:00.000Z');
    updatedUser.updatedAt = new Date('2026-01-02T00:00:00.000Z');
    updatedUser.fetchAiHandle = 'ada-fetch';

    const controller = new UserController({
      updateFetchAiHandle: jest.fn().mockResolvedValue(updatedUser),
    } as unknown as UserService);

    const result = await controller.updateFetchAiHandle(
      { fetchAiHandle: 'ada-fetch' } as UpdateFetchAiHandleRequest,
      currentUser,
    );

    expect(result).toEqual({
      error: null,
      user: {
        id: 'user-1',
        firstName: 'Ada',
        lastName: 'Lovelace',
        house: House.UNASSIGNED,
        points: 0,
        email: 'ada@ucsd.edu',
        accessType: UserAccessType.STANDARD,
        applicationStatus: ApplicationStatus.NOT_SUBMITTED,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
        fetchAiHandle: 'ada-fetch',
      },
    });
  });
});

describe('When a user deletes their account', () => {
  test('Then, error null is returned', async () => {
    const currentUser = new UserModel();
    currentUser.id = 'user-1';

    const controller = new UserController({
      deleteUser: jest.fn(),
    } as unknown as UserService);

    const result = await controller.deleteCurrentUser(currentUser);

    expect(result).toEqual({ error: null });
  });
});

describe('When a client verifies an invalid auth token', () => {
  test('Then, the token error is returned', async () => {
    const error = new Error('Invalid auth token');
    const controller = new UserController({
      checkAuthToken: jest.fn().mockRejectedValue(error),
    } as unknown as UserService);

    await expect(
      controller.verifyToken({ token: 'invalid-token' } as VerifyTokenRequest),
    ).rejects.toBe(error);
  });
});
