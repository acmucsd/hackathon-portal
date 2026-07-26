import { ForbiddenError } from 'routing-controllers';
import { InterestFormResponseController } from '../../api/controllers/InterestFormResponseController';
import {
  AddInterestedEmailRequest,
  AddInterestedPhoneRequest,
  AddListOfInterestedEmailRequest,
  AddListOfInterestedPhoneRequest,
  RemoveInterestedEmailRequest,
  RemoveInterestedPhoneRequest,
} from '../../api/validators/InterestFormResponseControllerRequests';
import { UserModel } from '../../models/UserModel';
import type { InterestFormResponseService } from '../../services/InterestFormResponseService';
import { UserAccessType } from '../../types/Enums';

describe('When a user checks their email interest status', () => {
  test('Then, the interest status is returned', async () => {
    const currentUser = new UserModel();
    currentUser.email = 'ada@ucsd.edu';
    currentUser.accessType = UserAccessType.STANDARD;

    const controller = new InterestFormResponseController({
      checkEmailForInterest: jest.fn().mockResolvedValue(true),
    } as unknown as InterestFormResponseService);

    const result = await controller.checkInterestByEmail(currentUser);

    expect(result).toEqual({ error: null, interest: true });
  });
});

describe('When a user is not interested by email', () => {
  test('Then, the false interest status is returned', async () => {
    const currentUser = new UserModel();
    currentUser.email = 'ada@ucsd.edu';

    const controller = new InterestFormResponseController({
      checkEmailForInterest: jest.fn().mockResolvedValue(false),
    } as unknown as InterestFormResponseService);

    const result = await controller.checkInterestByEmail(currentUser);

    expect(result).toEqual({ error: null, interest: false });
  });
});

describe('When an admin adds an interested email', () => {
  test('Then, the interested email is returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const interest = { uuid: 'interest-1', email: 'ada@ucsd.edu' };

    const controller = new InterestFormResponseController({
      addInterestedEmail: jest.fn().mockResolvedValue(interest),
    } as unknown as InterestFormResponseService);

    const result = await controller.addInterestedUserEmail(
      { email: 'ada@ucsd.edu' } as AddInterestedEmailRequest,
      adminUser,
    );

    expect(result).toEqual({ error: null, interest });
  });
});

describe('When a standard user adds an interested email', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new InterestFormResponseController({} as InterestFormResponseService);

    await expect(
      controller.addInterestedUserEmail(
        { email: 'ada@ucsd.edu' } as AddInterestedEmailRequest,
        standardUser,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin adds an interested phone', () => {
  test('Then, the interested phone is returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const interest = { uuid: 'interest-1', phone: '+18580000000' };

    const controller = new InterestFormResponseController({
      addInterestedPhone: jest.fn().mockResolvedValue(interest),
    } as unknown as InterestFormResponseService);

    const result = await controller.addInterestedUserPhone(
      { phone: '+18580000000' } as AddInterestedPhoneRequest,
      adminUser,
    );

    expect(result).toEqual({ error: null, interest });
  });
});

describe('When a standard user adds an interested phone', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new InterestFormResponseController({} as InterestFormResponseService);

    await expect(
      controller.addInterestedUserPhone(
        { phone: '+18580000000' } as AddInterestedPhoneRequest,
        standardUser,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin adds many interested emails', () => {
  test('Then, the interested emails are returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const interested = [
      { uuid: 'interest-1', email: 'ada@ucsd.edu' },
      { uuid: 'interest-2', email: 'grace@ucsd.edu' },
    ];

    const controller = new InterestFormResponseController({
      addListOfInterestedEmails: jest.fn().mockResolvedValue(interested),
    } as unknown as InterestFormResponseService);

    const result = await controller.addInterestedListOfUserEmails(
      { emails: ['ada@ucsd.edu', 'grace@ucsd.edu'] } as AddListOfInterestedEmailRequest,
      adminUser,
    );

    expect(result).toEqual({ error: null, interested });
  });
});

describe('When a standard user adds many interested emails', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new InterestFormResponseController({} as InterestFormResponseService);

    await expect(
      controller.addInterestedListOfUserEmails(
        { emails: ['ada@ucsd.edu'] } as AddListOfInterestedEmailRequest,
        standardUser,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin adds many interested phones', () => {
  test('Then, the interested phones are returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const interested = [
      { uuid: 'interest-1', phone: '+18580000000' },
      { uuid: 'interest-2', phone: '+18580000001' },
    ];

    const controller = new InterestFormResponseController({
      addListOfInterestedPhones: jest.fn().mockResolvedValue(interested),
    } as unknown as InterestFormResponseService);

    const result = await controller.addInterestedListOfUserPhones(
      { phones: ['+18580000000', '+18580000001'] } as AddListOfInterestedPhoneRequest,
      adminUser,
    );

    expect(result).toEqual({ error: null, interested });
  });
});

describe('When a standard user adds many interested phones', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new InterestFormResponseController({} as InterestFormResponseService);

    await expect(
      controller.addInterestedListOfUserPhones(
        { phones: ['+18580000000'] } as AddListOfInterestedPhoneRequest,
        standardUser,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin removes an interested email', () => {
  test('Then, error null is returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const controller = new InterestFormResponseController({
      removeInterestedEmail: jest.fn().mockResolvedValue(undefined),
    } as unknown as InterestFormResponseService);

    const result = await controller.removeInterestedUserEmail(
      { email: 'ada@ucsd.edu' } as RemoveInterestedEmailRequest,
      adminUser,
    );

    expect(result).toEqual({ error: null });
  });
});

describe('When a standard user removes an interested email', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new InterestFormResponseController({} as InterestFormResponseService);

    await expect(
      controller.removeInterestedUserEmail(
        { email: 'ada@ucsd.edu' } as RemoveInterestedEmailRequest,
        standardUser,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin removes an interested phone', () => {
  test('Then, error null is returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const controller = new InterestFormResponseController({
      removeInterestedPhone: jest.fn().mockResolvedValue(undefined),
    } as unknown as InterestFormResponseService);

    const result = await controller.removeInterestedUserPhone(
      { phone: '+18580000000' } as RemoveInterestedPhoneRequest,
      adminUser,
    );

    expect(result).toEqual({ error: null });
  });
});

describe('When a standard user removes an interested phone', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new InterestFormResponseController({} as InterestFormResponseService);

    await expect(
      controller.removeInterestedUserPhone(
        { phone: '+18580000000' } as RemoveInterestedPhoneRequest,
        standardUser,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin requests all interested emails and phones', () => {
  test('Then, the interested records are returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const interested = [
      { uuid: 'interest-1', email: 'ada@ucsd.edu' },
      { uuid: 'interest-2', phone: '+18580000000' },
    ];

    const controller = new InterestFormResponseController({
      findAllInterested: jest.fn().mockResolvedValue(interested),
    } as unknown as InterestFormResponseService);

    const result = await controller.getAllInterestedUserEmailsAndPhones(adminUser);

    expect(result).toEqual({ error: null, interested });
  });
});

describe('When a standard user requests all interested emails and phones', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new InterestFormResponseController({} as InterestFormResponseService);

    await expect(
      controller.getAllInterestedUserEmailsAndPhones(standardUser),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});
