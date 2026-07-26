import { BadRequestError, ForbiddenError } from 'routing-controllers';
import { AdminController } from '../../api/controllers/AdminController';
import {
  PaginationQueryParams,
  UpdateApplicationDecisionRequest,
  UpdateApplicationOpeningStatusRequest,
  UpdateUserAccessRequest,
} from '../../api/validators/AdminControllerRequests';
import {
  EmailParam,
  IdParam,
  UuidAndIdParam,
  UuidParam,
} from '../../api/validators/GenericRequests';
import { AttendanceModel } from '../../models/AttendanceModel';
import { EventModel } from '../../models/EventModel';
import { UserModel } from '../../models/UserModel';
import type { ApplicationConfigService } from '../../services/ApplicationConfigService';
import type { AttendanceService } from '../../services/AttendanceService';
import type { InterestFormResponseService } from '../../services/InterestFormResponseService';
import type { ResponseService } from '../../services/ResponseService';
import type { UserService } from '../../services/UserService';
import { PostAssignmentsRequest } from '../../types/ApiRequests';
import {
  ApplicationDecision,
  ApplicationStatus,
  Day,
  EventType,
  House,
  UserAccessType,
} from '../../types/Enums';

describe('When an admin requests an application by id', () => {
  test('Then, the application response is returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const response = { uuid: 'application-1' };

    const controller = new AdminController(
      {} as UserService,
      { getApplicationById: jest.fn().mockResolvedValue(response) } as unknown as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    const result = await controller.getApplicationById(
      adminUser,
      { id: 'application-1' } as IdParam,
    );

    expect(result).toEqual({ error: null, response });
  });
});

describe('When a standard user requests an application by id', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new AdminController(
      {} as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    await expect(
      controller.getApplicationById(standardUser, { id: 'application-1' } as IdParam),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin requests applications', () => {
  test('Then, the application responses are returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const responses = [{ uuid: 'application-1' }];

    const controller = new AdminController(
      {} as UserService,
      { getAllApplicationsSorted: jest.fn().mockResolvedValue(responses) } as unknown as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    const result = await controller.getApplications(
      adminUser,
      { offset: 0, limit: 10 } as PaginationQueryParams,
    );

    expect(result).toEqual({ error: null, responses });
  });
});

describe('When a standard user requests applications', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new AdminController(
      {} as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    await expect(
      controller.getApplications(
        standardUser,
        { offset: 0, limit: 10 } as PaginationQueryParams,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin requests an application decision', () => {
  test('Then, the admin-visible user profile is returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const applicant = new UserModel();
    applicant.id = 'applicant-1';
    applicant.firstName = 'Ada';
    applicant.lastName = 'Lovelace';
    applicant.house = House.UNASSIGNED;
    applicant.points = 0;
    applicant.email = 'ada@ucsd.edu';
    applicant.accessType = UserAccessType.STANDARD;
    applicant.applicationStatus = ApplicationStatus.SUBMITTED;
    applicant.createdAt = new Date('2026-01-01T00:00:00.000Z');
    applicant.updatedAt = new Date('2026-01-02T00:00:00.000Z');
    applicant.fetchAiHandle = null;
    applicant.applicationDecision = ApplicationDecision.ACCEPT;
    applicant.reviewerComments = 'Strong application';

    const controller = new AdminController(
      {
        findByIdWithLastDecisionUpdatedByRelation: jest.fn().mockResolvedValue(applicant),
      } as unknown as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    const result = await controller.getApplicationDecision(
      adminUser,
      { id: 'applicant-1' } as IdParam,
    );

    expect(result).toEqual({
      error: null,
      user: {
        id: 'applicant-1',
        firstName: 'Ada',
        lastName: 'Lovelace',
        house: House.UNASSIGNED,
        points: 0,
        email: 'ada@ucsd.edu',
        accessType: UserAccessType.STANDARD,
        applicationStatus: ApplicationStatus.SUBMITTED,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
        fetchAiHandle: null,
        applicationDecision: ApplicationDecision.ACCEPT,
        reviewerComments: 'Strong application',
        lastDecisionUpdatedBy: undefined,
      },
    });
  });
});

describe('When a standard user requests an application decision', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new AdminController(
      {} as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    await expect(
      controller.getApplicationDecision(standardUser, { id: 'applicant-1' } as IdParam),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin updates an application decision', () => {
  test('Then, the updated admin-visible user profile is returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const applicant = new UserModel();
    applicant.id = 'applicant-1';
    applicant.firstName = 'Ada';
    applicant.lastName = 'Lovelace';
    applicant.house = House.UNASSIGNED;
    applicant.points = 0;
    applicant.email = 'ada@ucsd.edu';
    applicant.accessType = UserAccessType.STANDARD;
    applicant.applicationStatus = ApplicationStatus.SUBMITTED;
    applicant.createdAt = new Date('2026-01-01T00:00:00.000Z');
    applicant.updatedAt = new Date('2026-01-02T00:00:00.000Z');
    applicant.fetchAiHandle = null;
    applicant.applicationDecision = ApplicationDecision.REJECT;
    applicant.reviewerComments = 'Not enough detail';

    const controller = new AdminController(
      {
        updateApplicationDecision: jest.fn().mockResolvedValue(applicant),
      } as unknown as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    const result = await controller.updateApplicationDecision(
      {
        applicationDecision: ApplicationDecision.REJECT,
        reviewerComments: 'Not enough detail',
      } as UpdateApplicationDecisionRequest,
      adminUser,
      { id: 'applicant-1' } as IdParam,
    );

    expect(result).toEqual({
      error: null,
      user: {
        id: 'applicant-1',
        firstName: 'Ada',
        lastName: 'Lovelace',
        house: House.UNASSIGNED,
        points: 0,
        email: 'ada@ucsd.edu',
        accessType: UserAccessType.STANDARD,
        applicationStatus: ApplicationStatus.SUBMITTED,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
        fetchAiHandle: null,
        applicationDecision: ApplicationDecision.REJECT,
        reviewerComments: 'Not enough detail',
        lastDecisionUpdatedBy: undefined,
      },
    });
  });
});

describe('When a standard user updates an application decision', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new AdminController(
      {} as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    await expect(
      controller.updateApplicationDecision(
        { applicationDecision: ApplicationDecision.ACCEPT } as UpdateApplicationDecisionRequest,
        standardUser,
        { id: 'applicant-1' } as IdParam,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin confirms a user', () => {
  test('Then, the confirmed user is returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const confirmedUser = new UserModel();
    confirmedUser.id = 'applicant-1';
    confirmedUser.applicationStatus = ApplicationStatus.CONFIRMED;

    const controller = new AdminController(
      {
        updateUserStatus: jest.fn().mockResolvedValue(confirmedUser),
      } as unknown as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    const result = await controller.confirmUserStatus(
      adminUser,
      { id: 'applicant-1' } as IdParam,
    );

    expect(result).toEqual({ error: null, user: confirmedUser });
  });
});

describe('When a standard user confirms a user', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new AdminController(
      {} as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    await expect(
      controller.confirmUserStatus(standardUser, { id: 'applicant-1' } as IdParam),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin requests all users', () => {
  test('Then, the users are returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const users = [{ id: 'user-1' }];

    const controller = new AdminController(
      { getAllUsers: jest.fn().mockResolvedValue(users) } as unknown as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    const result = await controller.getUsers(adminUser);

    expect(result).toEqual({ error: null, users });
  });
});

describe('When a standard user requests all users', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new AdminController(
      {} as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    await expect(controller.getUsers(standardUser)).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin requests a user application', () => {
  test('Then, the user application is returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const applicant = new UserModel();
    applicant.id = 'applicant-1';

    const application = { uuid: 'application-1' };

    const controller = new AdminController(
      { findById: jest.fn().mockResolvedValue(applicant) } as unknown as UserService,
      { getUserApplication: jest.fn().mockResolvedValue(application) } as unknown as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    const result = await controller.getUserWithApplications(
      adminUser,
      { id: 'applicant-1' } as IdParam,
    );

    expect(result).toEqual({ error: null, application });
  });
});

describe('When a standard user requests a user application', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new AdminController(
      {} as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    await expect(
      controller.getUserWithApplications(standardUser, { id: 'applicant-1' } as IdParam),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin requests an email verification link', () => {
  test('Then, the email verification link is returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const emailVerificationLink = 'https://example.com/verify';

    const controller = new AdminController(
      {
        getEmailVerificationLink: jest.fn().mockResolvedValue(emailVerificationLink),
      } as unknown as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    const result = await controller.getEmailVerificationLink(
      adminUser,
      { email: 'user@ucsd.edu' } as EmailParam,
    );

    expect(result).toEqual({ error: null, emailVerificationLink });
  });
});

describe('When a standard user requests an email verification link', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new AdminController(
      {} as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    await expect(
      controller.getEmailVerificationLink(
        standardUser,
        { email: 'user@ucsd.edu' } as EmailParam,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin requests a password reset link', () => {
  test('Then, the password reset link is returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const passwordResetLink = 'https://example.com/reset';

    const controller = new AdminController(
      {
        getPasswordResetLink: jest.fn().mockResolvedValue(passwordResetLink),
      } as unknown as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    const result = await controller.getPasswordResetLink(
      adminUser,
      { email: 'user@ucsd.edu' } as EmailParam,
    );

    expect(result).toEqual({ error: null, passwordResetLink });
  });
});

describe('When a standard user requests a password reset link', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new AdminController(
      {} as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    await expect(
      controller.getPasswordResetLink(
        standardUser,
        { email: 'user@ucsd.edu' } as EmailParam,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin requests user waivers', () => {
  test('Then, the waiver responses are returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const applicant = new UserModel();
    applicant.id = 'applicant-1';

    const responses = [{ uuid: 'waiver-1' }];

    const controller = new AdminController(
      { findById: jest.fn().mockResolvedValue(applicant) } as unknown as UserService,
      { getUserWaivers: jest.fn().mockResolvedValue(responses) } as unknown as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    const result = await controller.getWaiversById(
      adminUser,
      { id: 'applicant-1' } as IdParam,
    );

    expect(result).toEqual({ error: null, responses });
  });
});

describe('When a standard user requests user waivers', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new AdminController(
      {} as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    await expect(
      controller.getWaiversById(standardUser, { id: 'applicant-1' } as IdParam),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin requests a user RSVP', () => {
  test('Then, the RSVP response is returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const applicant = new UserModel();
    applicant.id = 'applicant-1';

    const response = { uuid: 'rsvp-1' };

    const controller = new AdminController(
      { findById: jest.fn().mockResolvedValue(applicant) } as unknown as UserService,
      { getUserRSVP: jest.fn().mockResolvedValue(response) } as unknown as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    const result = await controller.getRSVPById(
      adminUser,
      { id: 'applicant-1' } as IdParam,
    );

    expect(result).toEqual({ error: null, response });
  });
});

describe('When a standard user requests a user RSVP', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new AdminController(
      {} as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    await expect(
      controller.getRSVPById(standardUser, { id: 'applicant-1' } as IdParam),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin requests event attendance', () => {
  test('Then, public attendance records are returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const attendee = new UserModel();
    attendee.id = 'user-1';
    attendee.firstName = 'Grace';
    attendee.lastName = 'Hopper';
    attendee.house = House.GEISEL;
    attendee.points = 12;

    const event = new EventModel();
    event.uuid = 'event-1';
    event.name = 'Opening Ceremony';
    event.type = EventType.MAIN_EVENT;
    event.host = 'ACM';
    event.location = 'Price Center';
    event.locationLink = 'https://example.com/location';
    event.description = 'Kickoff';
    event.day = Day.SATURDAY;
    event.startTime = '10:00';
    event.endTime = '11:00';
    event.published = true;
    event.pointValue = 5;

    const attendance = new AttendanceModel();
    attendance.user = attendee;
    attendance.event = event;
    attendance.timestamp = new Date('2026-01-03T00:00:00.000Z');

    const controller = new AdminController(
      {} as UserService,
      {} as ResponseService,
      { getAttendancesForEvent: jest.fn().mockResolvedValue([attendance]) } as unknown as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    const result = await controller.getAttendanceForEvent(
      adminUser,
      { uuid: 'event-1' } as UuidParam,
    );

    expect(result).toEqual({
      error: null,
      attendances: [
        {
          user: {
            id: 'user-1',
            firstName: 'Grace',
            lastName: 'Hopper',
            house: House.GEISEL,
            points: 12,
          },
          event: {
            uuid: 'event-1',
            name: 'Opening Ceremony',
            type: EventType.MAIN_EVENT,
            host: 'ACM',
            location: 'Price Center',
            locationLink: 'https://example.com/location',
            description: 'Kickoff',
            day: Day.SATURDAY,
            startTime: '10:00',
            endTime: '11:00',
            published: true,
            pointValue: 5,
          },
          timestamp: new Date('2026-01-03T00:00:00.000Z'),
        },
      ],
    });
  });
});

describe('When a standard user requests event attendance', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new AdminController(
      {} as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    await expect(
      controller.getAttendanceForEvent(standardUser, { uuid: 'event-1' } as UuidParam),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin marks event attendance', () => {
  test('Then, the event and updated user are returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const attendee = new UserModel();
    attendee.id = 'user-1';
    attendee.firstName = 'Grace';
    attendee.lastName = 'Hopper';
    attendee.house = House.GEISEL;
    attendee.points = 12;

    const event = new EventModel();
    event.uuid = 'event-1';
    event.name = 'Opening Ceremony';
    event.type = EventType.MAIN_EVENT;
    event.host = 'ACM';
    event.location = 'Price Center';
    event.locationLink = 'https://example.com/location';
    event.description = 'Kickoff';
    event.day = Day.SATURDAY;
    event.startTime = '10:00';
    event.endTime = '11:00';
    event.published = true;
    event.pointValue = 5;

    const attendance = new AttendanceModel();
    attendance.user = attendee;
    attendance.event = event;
    attendance.timestamp = new Date('2026-01-03T00:00:00.000Z');

    const updatedUser = {
      id: 'user-1',
      firstName: 'Grace',
      lastName: 'Hopper',
      house: House.GEISEL,
      points: 17,
    };

    const controller = new AdminController(
      { addHousePointsToUser: jest.fn().mockResolvedValue(updatedUser) } as unknown as UserService,
      {} as ResponseService,
      { attendEvent: jest.fn().mockResolvedValue(attendance) } as unknown as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    const result = await controller.attendEvent(
      adminUser,
      { uuid: 'event-1', id: 'user-1' } as UuidAndIdParam,
    );

    expect(result).toEqual({
      error: null,
      event: {
        uuid: 'event-1',
        name: 'Opening Ceremony',
        type: EventType.MAIN_EVENT,
        host: 'ACM',
        location: 'Price Center',
        locationLink: 'https://example.com/location',
        description: 'Kickoff',
        day: Day.SATURDAY,
        startTime: '10:00',
        endTime: '11:00',
        published: true,
        pointValue: 5,
      },
      user: updatedUser,
    });
  });
});

describe('When a standard user marks event attendance', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new AdminController(
      {} as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    await expect(
      controller.attendEvent(
        standardUser,
        { uuid: 'event-1', id: 'user-1' } as UuidAndIdParam,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin releases decisions', () => {
  test('Then, user profiles are returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const releasedUser = new UserModel();
    releasedUser.id = 'user-1';
    releasedUser.firstName = 'Grace';
    releasedUser.lastName = 'Hopper';
    releasedUser.house = House.GEISEL;
    releasedUser.points = 12;
    releasedUser.email = 'grace@ucsd.edu';
    releasedUser.accessType = UserAccessType.STANDARD;
    releasedUser.applicationStatus = ApplicationStatus.ACCEPTED;
    releasedUser.createdAt = new Date('2026-01-01T00:00:00.000Z');
    releasedUser.updatedAt = new Date('2026-01-02T00:00:00.000Z');
    releasedUser.fetchAiHandle = null;

    const controller = new AdminController(
      { releaseApplicationDecisions: jest.fn().mockResolvedValue([releasedUser]) } as unknown as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    const result = await controller.releaseDecisions(adminUser);

    expect(result).toEqual({
      error: null,
      users: [
        {
          id: 'user-1',
          firstName: 'Grace',
          lastName: 'Hopper',
          house: House.GEISEL,
          points: 12,
          email: 'grace@ucsd.edu',
          accessType: UserAccessType.STANDARD,
          applicationStatus: ApplicationStatus.ACCEPTED,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-02T00:00:00.000Z'),
          fetchAiHandle: null,
        },
      ],
    });
  });
});

describe('When a standard user releases decisions', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new AdminController(
      {} as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    await expect(controller.releaseDecisions(standardUser)).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When a super admin sets applications open status', () => {
  test('Then, the updated open status is returned', async () => {
    const superAdminUser = new UserModel();
    superAdminUser.id = 'super-admin-1';
    superAdminUser.accessType = UserAccessType.SUPER_ADMIN;

    const updatedAt = new Date('2026-01-04T00:00:00.000Z');

    const controller = new AdminController(
      {} as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {
        setApplicationSingleton: jest.fn().mockResolvedValue({
          applicationsOpen: true,
          updatedBy: 'super-admin-1',
          updatedAt,
        }),
      } as unknown as ApplicationConfigService,
    );

    const result = await controller.setApplicationsOpen(
      superAdminUser,
      { applicationsOpen: true } as UpdateApplicationOpeningStatusRequest,
    );

    expect(result).toEqual({
      error: null,
      applicationsOpen: true,
      updatedBy: 'super-admin-1',
      updatedAt,
    });
  });
});

describe('When a regular admin sets applications open status', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const controller = new AdminController(
      {} as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    await expect(
      controller.setApplicationsOpen(
        adminUser,
        { applicationsOpen: true } as UpdateApplicationOpeningStatusRequest,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin marks acceptance deadline passed', () => {
  test('Then, the updated count is returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const controller = new AdminController(
      { setAcceptedUsersToDeadlinePassed: jest.fn().mockResolvedValue(3) } as unknown as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    const result = await controller.setAcceptanceDeadlinePassed(adminUser);

    expect(result).toEqual({ error: null, updatedCount: 3 });
  });
});

describe('When a standard user marks acceptance deadline passed', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new AdminController(
      {} as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    await expect(
      controller.setAcceptanceDeadlinePassed(standardUser),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin randomizes assignments', () => {
  test('Then, new assignments are returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const newAssignments = [{ applicant: { id: 'user-1' }, reviewer: undefined }];

    const controller = new AdminController(
      { randomlyAssignReviews: jest.fn().mockResolvedValue(newAssignments) } as unknown as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    const result = await controller.postAssignmentsRandom(adminUser);

    expect(result).toEqual({ error: null, newAssignments });
  });
});

describe('When a standard user randomizes assignments', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new AdminController(
      {} as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    await expect(controller.postAssignmentsRandom(standardUser)).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin posts assignments', () => {
  test('Then, new assignments are returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const newAssignments = [{ applicant: { id: 'user-1' }, reviewer: undefined }];

    const controller = new AdminController(
      { assignReviews: jest.fn().mockResolvedValue(newAssignments) } as unknown as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    const result = await controller.postAssignments(
      {
        assignments: [{ applicantId: 'user-1', reviewerId: undefined }],
      } as PostAssignmentsRequest,
      adminUser,
    );

    expect(result).toEqual({ error: null, newAssignments });
  });
});

describe('When a standard user posts assignments', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new AdminController(
      {} as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    await expect(
      controller.postAssignments(
        { assignments: [{ applicantId: 'user-1', reviewerId: undefined }] } as PostAssignmentsRequest,
        standardUser,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin requests assignments', () => {
  test('Then, assignments are returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const controller = new AdminController(
      {} as UserService,
      { getAllApplicationsWithReviewerRelation: jest.fn().mockResolvedValue([]) } as unknown as ResponseService,
      {} as AttendanceService,
      { findAllInterested: jest.fn().mockResolvedValue([]) } as unknown as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    const result = await controller.getAssignments(adminUser);

    expect(result).toEqual({ error: null, assignments: [] });
  });
});

describe('When a standard user requests assignments', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new AdminController(
      {} as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    await expect(controller.getAssignments(standardUser)).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin requests assignments for a reviewer', () => {
  test('Then, only that reviewer assignments are returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const reviewer = new UserModel();
    reviewer.id = 'reviewer-1';
    reviewer.firstName = 'Reviewer';
    reviewer.lastName = 'One';
    reviewer.house = House.GEISEL;
    reviewer.points = 3;
    reviewer.email = 'reviewer@ucsd.edu';
    reviewer.accessType = UserAccessType.ADMIN;
    reviewer.applicationStatus = ApplicationStatus.NOT_SUBMITTED;
    reviewer.createdAt = new Date('2026-01-01T00:00:00.000Z');
    reviewer.updatedAt = new Date('2026-01-02T00:00:00.000Z');
    reviewer.fetchAiHandle = null;
    reviewer.applicationDecision = ApplicationDecision.NO_DECISION;
    reviewer.reviewerComments = null;

    const matchingApplicant = new UserModel();
    matchingApplicant.id = 'applicant-1';
    matchingApplicant.firstName = 'Ada';
    matchingApplicant.lastName = 'Lovelace';
    matchingApplicant.house = House.UNASSIGNED;
    matchingApplicant.points = 0;
    matchingApplicant.email = 'ada@ucsd.edu';
    matchingApplicant.accessType = UserAccessType.STANDARD;
    matchingApplicant.applicationStatus = ApplicationStatus.SUBMITTED;
    matchingApplicant.createdAt = new Date('2026-01-01T00:00:00.000Z');
    matchingApplicant.updatedAt = new Date('2026-01-02T00:00:00.000Z');
    matchingApplicant.fetchAiHandle = null;
    matchingApplicant.applicationDecision = ApplicationDecision.NO_DECISION;
    matchingApplicant.reviewerComments = null;
    matchingApplicant.reviewer = reviewer;

    const otherReviewer = new UserModel();
    otherReviewer.id = 'reviewer-2';

    const otherApplicant = new UserModel();
    otherApplicant.id = 'applicant-2';
    otherApplicant.email = 'other@ucsd.edu';
    otherApplicant.reviewer = otherReviewer;

    const controller = new AdminController(
      {} as UserService,
      {
        getAllApplicationsWithReviewerRelation: jest.fn().mockResolvedValue([
          { user: matchingApplicant, data: { phoneNumber: '111', university: 'UCSD' } },
          { user: otherApplicant, data: { phoneNumber: '222', university: 'UCSD' } },
        ]),
      } as unknown as ResponseService,
      {} as AttendanceService,
      { findAllInterested: jest.fn().mockResolvedValue([]) } as unknown as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    const result = await controller.getMyAssignments(
      adminUser,
      { id: 'reviewer-1' } as IdParam,
    );

    expect(result).toEqual({
      error: null,
      assignments: [
        {
          applicant: {
            id: 'applicant-1',
            firstName: 'Ada',
            lastName: 'Lovelace',
            house: House.UNASSIGNED,
            points: 0,
            email: 'ada@ucsd.edu',
            accessType: UserAccessType.STANDARD,
            applicationStatus: ApplicationStatus.SUBMITTED,
            createdAt: new Date('2026-01-01T00:00:00.000Z'),
            updatedAt: new Date('2026-01-02T00:00:00.000Z'),
            fetchAiHandle: null,
            applicationDecision: ApplicationDecision.NO_DECISION,
            reviewerComments: null,
            lastDecisionUpdatedBy: undefined,
            didInterestForm: false,
            university: 'UCSD',
          },
          reviewer: {
            id: 'reviewer-1',
            firstName: 'Reviewer',
            lastName: 'One',
            house: House.GEISEL,
            points: 3,
            email: 'reviewer@ucsd.edu',
            accessType: UserAccessType.ADMIN,
            applicationStatus: ApplicationStatus.NOT_SUBMITTED,
            createdAt: new Date('2026-01-01T00:00:00.000Z'),
            updatedAt: new Date('2026-01-02T00:00:00.000Z'),
            fetchAiHandle: null,
            applicationDecision: ApplicationDecision.NO_DECISION,
            reviewerComments: null,
            lastDecisionUpdatedBy: undefined,
          },
        },
      ],
    });
  });
});

describe('When a standard user requests assignments for a reviewer', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new AdminController(
      {} as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    await expect(
      controller.getMyAssignments(standardUser, { id: 'reviewer-1' } as IdParam),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an applicant matches the interest form by email', () => {
  test('Then, the assignment marks the applicant as interested', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const applicant = new UserModel();
    applicant.id = 'applicant-1';
    applicant.firstName = 'Ada';
    applicant.lastName = 'Lovelace';
    applicant.house = House.UNASSIGNED;
    applicant.points = 0;
    applicant.email = 'ada@ucsd.edu';
    applicant.accessType = UserAccessType.STANDARD;
    applicant.applicationStatus = ApplicationStatus.SUBMITTED;
    applicant.createdAt = new Date('2026-01-01T00:00:00.000Z');
    applicant.updatedAt = new Date('2026-01-02T00:00:00.000Z');
    applicant.fetchAiHandle = null;
    applicant.applicationDecision = ApplicationDecision.NO_DECISION;
    applicant.reviewerComments = null;

    const controller = new AdminController(
      {} as UserService,
      {
        getAllApplicationsWithReviewerRelation: jest.fn().mockResolvedValue([
          { user: applicant, data: { phoneNumber: '111', university: 'UCSD' } },
        ]),
      } as unknown as ResponseService,
      {} as AttendanceService,
      { findAllInterested: jest.fn().mockResolvedValue([{ email: 'ada@ucsd.edu' }]) } as unknown as
      InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    const result = await controller.getAssignments(adminUser);

    expect(result.assignments[0].applicant.didInterestForm).toBe(true);
  });
});

describe('When an applicant matches the interest form by phone', () => {
  test('Then, the assignment marks the applicant as interested', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const applicant = new UserModel();
    applicant.id = 'applicant-1';
    applicant.firstName = 'Ada';
    applicant.lastName = 'Lovelace';
    applicant.house = House.UNASSIGNED;
    applicant.points = 0;
    applicant.email = 'ada@ucsd.edu';
    applicant.accessType = UserAccessType.STANDARD;
    applicant.applicationStatus = ApplicationStatus.SUBMITTED;
    applicant.createdAt = new Date('2026-01-01T00:00:00.000Z');
    applicant.updatedAt = new Date('2026-01-02T00:00:00.000Z');
    applicant.fetchAiHandle = null;
    applicant.applicationDecision = ApplicationDecision.NO_DECISION;
    applicant.reviewerComments = null;

    const controller = new AdminController(
      {} as UserService,
      {
        getAllApplicationsWithReviewerRelation: jest.fn().mockResolvedValue([
          { user: applicant, data: { phoneNumber: '111', university: 'UCSD' } },
        ]),
      } as unknown as ResponseService,
      {} as AttendanceService,
      { findAllInterested: jest.fn().mockResolvedValue([{ phone: '111' }]) } as unknown as
      InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    const result = await controller.getAssignments(adminUser);

    expect(result.assignments[0].applicant.didInterestForm).toBe(true);
  });
});

describe('When an applicant does not match the interest form', () => {
  test('Then, the assignment marks the applicant as not interested', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const applicant = new UserModel();
    applicant.id = 'applicant-1';
    applicant.firstName = 'Ada';
    applicant.lastName = 'Lovelace';
    applicant.house = House.UNASSIGNED;
    applicant.points = 0;
    applicant.email = 'ada@ucsd.edu';
    applicant.accessType = UserAccessType.STANDARD;
    applicant.applicationStatus = ApplicationStatus.SUBMITTED;
    applicant.createdAt = new Date('2026-01-01T00:00:00.000Z');
    applicant.updatedAt = new Date('2026-01-02T00:00:00.000Z');
    applicant.fetchAiHandle = null;
    applicant.applicationDecision = ApplicationDecision.NO_DECISION;
    applicant.reviewerComments = null;

    const controller = new AdminController(
      {} as UserService,
      {
        getAllApplicationsWithReviewerRelation: jest.fn().mockResolvedValue([
          { user: applicant, data: { phoneNumber: '111', university: 'UCSD' } },
        ]),
      } as unknown as ResponseService,
      {} as AttendanceService,
      { findAllInterested: jest.fn().mockResolvedValue([]) } as unknown as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    const result = await controller.getAssignments(adminUser);

    expect(result.assignments[0].applicant.didInterestForm).toBe(false);
  });
});

describe('When an admin requests reviewer overview', () => {
  test('Then, reviewer overview data is returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const dataToReturn = {
      reviewers: [
        {
          reviewerId: 'reviewer-1',
          reviewerFirstName: 'Reviewer',
          reviewerLastName: 'One',
          applicants: [],
          total: 0,
          accept: 0,
          reject: 0,
          waitlist: 0,
          noDecision: 0,
          acceptedNonUcsd: 0,
          acceptedNonUcsdPercentage: null,
        },
      ],
    };

    const controller = new AdminController(
      { getReviewerOverview: jest.fn().mockResolvedValue(dataToReturn) } as unknown as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    const result = await controller.getReviewerOverview(adminUser);

    expect(result).toEqual({ error: null, dataToReturn });
  });
});

describe('When a standard user requests reviewer overview', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new AdminController(
      {} as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    await expect(controller.getReviewerOverview(standardUser)).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When a super admin updates another user access', () => {
  test('Then, the updated user profile is returned', async () => {
    const superAdminUser = new UserModel();
    superAdminUser.email = 'super@ucsd.edu';
    superAdminUser.accessType = UserAccessType.SUPER_ADMIN;

    const updatedUser = new UserModel();
    updatedUser.id = 'user-1';
    updatedUser.firstName = 'Grace';
    updatedUser.lastName = 'Hopper';
    updatedUser.house = House.GEISEL;
    updatedUser.points = 12;
    updatedUser.email = 'grace@ucsd.edu';
    updatedUser.accessType = UserAccessType.ADMIN;
    updatedUser.applicationStatus = ApplicationStatus.NOT_SUBMITTED;
    updatedUser.createdAt = new Date('2026-01-01T00:00:00.000Z');
    updatedUser.updatedAt = new Date('2026-01-02T00:00:00.000Z');
    updatedUser.fetchAiHandle = null;

    const controller = new AdminController(
      { updateUserAccess: jest.fn().mockResolvedValue(updatedUser) } as unknown as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    const result = await controller.updateUserAccess(
      superAdminUser,
      { email: 'grace@ucsd.edu', access: UserAccessType.ADMIN } as UpdateUserAccessRequest,
    );

    expect(result).toEqual({
      error: null,
      updates: {
        id: 'user-1',
        firstName: 'Grace',
        lastName: 'Hopper',
        house: House.GEISEL,
        points: 12,
        email: 'grace@ucsd.edu',
        accessType: UserAccessType.ADMIN,
        applicationStatus: ApplicationStatus.NOT_SUBMITTED,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
        fetchAiHandle: null,
      },
    });
  });
});

describe('When a regular admin updates user access', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const adminUser = new UserModel();
    adminUser.email = 'admin@ucsd.edu';
    adminUser.accessType = UserAccessType.ADMIN;

    const controller = new AdminController(
      {} as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    await expect(
      controller.updateUserAccess(
        adminUser,
        { email: 'user@ucsd.edu', access: UserAccessType.MANAGER } as UpdateUserAccessRequest,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When a super admin updates their own access', () => {
  test('Then, a BadRequestError is thrown', async () => {
    const superAdminUser = new UserModel();
    superAdminUser.email = 'super@ucsd.edu';
    superAdminUser.accessType = UserAccessType.SUPER_ADMIN;

    const controller = new AdminController(
      {} as UserService,
      {} as ResponseService,
      {} as AttendanceService,
      {} as InterestFormResponseService,
      {} as ApplicationConfigService,
    );

    await expect(
      controller.updateUserAccess(
        superAdminUser,
        { email: 'super@ucsd.edu', access: UserAccessType.ADMIN } as UpdateUserAccessRequest,
      ),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
