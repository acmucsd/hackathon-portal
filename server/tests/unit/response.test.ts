import { ResponseController } from '../../api/controllers/ResponseController';
import { Application, RSVP, Waiver } from '../../api/validators/ResponseRequests';
import { UserModel } from '../../models/UserModel';
import type { ResponseService } from '../../services/ResponseService';
import type { File } from '../../types/ApiRequests';
import { FormType, Yes } from '../../types/Enums';

describe('When a user requests their responses', () => {
  test('Then, the responses are returned', async () => {
    const currentUser = new UserModel();
    currentUser.id = 'user-1';

    const responses = [{ uuid: 'response-1' }];

    const controller = new ResponseController({
      getUserResponses: jest.fn().mockResolvedValue(responses),
    } as unknown as ResponseService);

    const result = await controller.getResponsesForCurrentUser(currentUser);

    expect(result).toEqual({ error: null, responses });
  });
});

describe('When a user requests their application', () => {
  test('Then, the application response is returned', async () => {
    const currentUser = new UserModel();
    currentUser.id = 'user-1';

    const response = { uuid: 'application-1' };

    const controller = new ResponseController({
      getUserApplication: jest.fn().mockResolvedValue(response),
    } as unknown as ResponseService);

    const result = await controller.getApplication(currentUser);

    expect(result).toEqual({ error: null, response });
  });
});

describe('When a user submits an application', () => {
  test('Then, the application response is returned', async () => {
    const currentUser = new UserModel();
    currentUser.id = 'user-1';

    const application = { motivation: 'I want to build.' } as Application;
    const file = { originalname: 'resume.pdf' } as File;
    const response = { uuid: 'application-1' };

    const controller = new ResponseController({
      submitUserApplication: jest.fn().mockResolvedValue(response),
    } as unknown as ResponseService);

    const result = await controller.submitApplication(
      application,
      currentUser,
      file,
    );

    expect(result).toEqual({ error: null, response });
  });
});

describe('When a user updates an application with a replacement resume', () => {
  test('Then, the updated application response is returned', async () => {
    const currentUser = new UserModel();
    currentUser.id = 'user-1';

    const application = { motivation: 'Updated motivation.' } as Application;
    const file = { originalname: 'updated-resume.pdf' } as File;
    const response = {
      uuid: 'application-1',
      data: { resumeLink: 'updated-resume.pdf' },
    };

    const controller = new ResponseController({
      updateUserApplication: jest.fn((
        _user: UserModel,
        _application: Application,
        resume: File | undefined,
      ) => Promise.resolve({
        uuid: 'application-1',
        data: { resumeLink: resume?.originalname },
      })),
    } as unknown as ResponseService);

    const result = await controller.updateApplication(application, currentUser, file);

    expect(result).toEqual({ error: null, response });
  });
});

describe('When a user deletes their application', () => {
  test('Then, error null is returned', async () => {
    const currentUser = new UserModel();
    currentUser.id = 'user-1';

    const controller = new ResponseController({
      deleteUserApplication: jest.fn().mockResolvedValue(undefined),
    } as unknown as ResponseService);

    const result = await controller.deleteApplication(currentUser);

    expect(result).toEqual({ error: null });
  });
});

describe('When a user submits a liability waiver', () => {
  test('Then, the waiver response is returned', async () => {
    const currentUser = new UserModel();
    currentUser.id = 'user-1';

    const waiver = {
      participantName: 'Ada Lovelace',
      dateOfBirth: '2000-01-01',
      signature: 'Ada Lovelace',
      date: '2026-01-01',
    } as Waiver;
    const response = {
      uuid: 'liability-waiver-1',
      formType: FormType.LIABILITY_WAIVER,
    };

    const controller = new ResponseController({
      submitUserWaiver: jest.fn((
        _user: UserModel,
        _waiver: Waiver,
        formType: FormType,
      ) => Promise.resolve({ uuid: 'liability-waiver-1', formType })),
    } as unknown as ResponseService);

    const result = await controller.submitLiabilityWaiver(waiver, currentUser);

    expect(result).toEqual({ error: null, response });
  });
});

describe('When a user submits a photo release', () => {
  test('Then, the photo release response is returned', async () => {
    const currentUser = new UserModel();
    currentUser.id = 'user-1';

    const waiver = {
      participantName: 'Ada Lovelace',
      dateOfBirth: '2000-01-01',
      signature: 'Ada Lovelace',
      date: '2026-01-01',
    } as Waiver;
    const response = {
      uuid: 'photo-release-1',
      formType: FormType.PHOTO_RELEASE,
    };

    const controller = new ResponseController({
      submitUserWaiver: jest.fn((
        _user: UserModel,
        _waiver: Waiver,
        formType: FormType,
      ) => Promise.resolve({ uuid: 'photo-release-1', formType })),
    } as unknown as ResponseService);

    const result = await controller.submitPhotoRelease(waiver, currentUser);

    expect(result).toEqual({ error: null, response });
  });
});

describe('When a user submits an RSVP', () => {
  test('Then, the RSVP response is returned', async () => {
    const currentUser = new UserModel();
    currentUser.id = 'user-1';

    const rsvp = {
      willAttend: Yes.YES,
      joinedDiscord: Yes.YES,
      additionalComments: 'See you there.',
    } as RSVP;
    const response = { uuid: 'rsvp-1' };

    const controller = new ResponseController({
      submitUserRSVP: jest.fn().mockResolvedValue(response),
    } as unknown as ResponseService);

    const result = await controller.submitRSVP(rsvp, currentUser);

    expect(result).toEqual({ error: null, response });
  });
});
