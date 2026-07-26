import { ForbiddenError } from 'routing-controllers';
import { EventController } from '../../api/controllers/EventController';
import {
  CreateEventRequest,
  UpdateEventRequest,
} from '../../api/validators/EventControllerRequests';
import { UuidParam } from '../../api/validators/GenericRequests';
import { EventModel } from '../../models/EventModel';
import { UserModel } from '../../models/UserModel';
import type { EventService } from '../../services/EventService';
import { Day, EventType, UserAccessType } from '../../types/Enums';

describe('When an admin creates an event', () => {
  test('Then, the public event is returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

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

    const controller = new EventController({
      createEvent: jest.fn().mockResolvedValue(event),
    } as unknown as EventService);

    const result = await controller.createEvent(
      {
        event: {
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
      } as CreateEventRequest,
      adminUser,
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
    });
  });
});

describe('When a standard user creates an event', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new EventController({} as EventService);

    await expect(
      controller.createEvent(
        {
          event: {
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
        } as CreateEventRequest,
        standardUser,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin requests all events', () => {
  test('Then, public events are returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

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
    event.published = false;
    event.pointValue = 5;

    const controller = new EventController({
      getAllEvents: jest.fn().mockResolvedValue([event]),
    } as unknown as EventService);

    const result = await controller.getAllEvents(adminUser);

    expect(result).toEqual({
      error: null,
      events: [
        {
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
          published: false,
          pointValue: 5,
        },
      ],
    });
  });
});

describe('When a standard user requests all events', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new EventController({} as EventService);

    await expect(controller.getAllEvents(standardUser)).rejects.toBeInstanceOf(
      ForbiddenError,
    );
  });
});

describe('When a standard user requests published events', () => {
  test('Then, public events are returned', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

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

    const controller = new EventController({
      getPublishedEvents: jest.fn().mockResolvedValue([event]),
    } as unknown as EventService);

    const result = await controller.getPublishedEvents(standardUser);

    expect(result).toEqual({
      error: null,
      events: [
        {
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
      ],
    });
  });
});

describe('When a standard user requests a published event by id', () => {
  test('Then, the public event is returned', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

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

    const controller = new EventController({
      findByUuid: jest.fn().mockResolvedValue(event),
    } as unknown as EventService);

    const result = await controller.getOneEvent(
      { uuid: 'event-1' } as UuidParam,
      standardUser,
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
    });
  });
});

describe('When an admin requests an unpublished event by id', () => {
  test('Then, the public event is returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

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
    event.published = false;
    event.pointValue = 5;

    const controller = new EventController({
      findByUuid: jest.fn().mockResolvedValue(event),
    } as unknown as EventService);

    const result = await controller.getOneEvent(
      { uuid: 'event-1' } as UuidParam,
      adminUser,
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
        published: false,
        pointValue: 5,
      },
    });
  });
});

describe('When a standard user requests an unpublished event by id', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const event = new EventModel();
    event.published = false;

    const controller = new EventController({
      findByUuid: jest.fn().mockResolvedValue(event),
    } as unknown as EventService);

    await expect(
      controller.getOneEvent(
        { uuid: 'event-1' } as UuidParam,
        standardUser,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin updates an event', () => {
  test('Then, the updated public event is returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const event = new EventModel();
    event.uuid = 'event-1';
    event.name = 'Updated Ceremony';
    event.type = EventType.MAIN_EVENT;
    event.host = 'ACM';
    event.location = 'Price Center';
    event.locationLink = 'https://example.com/location';
    event.description = 'Updated kickoff';
    event.day = Day.SATURDAY;
    event.startTime = '10:30';
    event.endTime = '11:30';
    event.published = true;
    event.pointValue = 10;

    const controller = new EventController({
      updateByUuid: jest.fn().mockResolvedValue(event),
    } as unknown as EventService);

    const result = await controller.updateEvent(
      { uuid: 'event-1' } as UuidParam,
      {
        event: {
          name: 'Updated Ceremony',
          type: EventType.MAIN_EVENT,
          host: 'ACM',
          location: 'Price Center',
          locationLink: 'https://example.com/location',
          description: 'Updated kickoff',
          day: Day.SATURDAY,
          startTime: '10:30',
          endTime: '11:30',
          published: true,
          pointValue: 10,
        },
      } as UpdateEventRequest,
      adminUser,
    );

    expect(result).toEqual({
      error: null,
      event: {
        uuid: 'event-1',
        name: 'Updated Ceremony',
        type: EventType.MAIN_EVENT,
        host: 'ACM',
        location: 'Price Center',
        locationLink: 'https://example.com/location',
        description: 'Updated kickoff',
        day: Day.SATURDAY,
        startTime: '10:30',
        endTime: '11:30',
        published: true,
        pointValue: 10,
      },
    });
  });
});

describe('When a standard user updates an event', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new EventController({} as EventService);

    await expect(
      controller.updateEvent(
        { uuid: 'event-1' } as UuidParam,
        {
          event: {
            name: 'Updated Ceremony',
            type: EventType.MAIN_EVENT,
            host: 'ACM',
            location: 'Price Center',
            locationLink: 'https://example.com/location',
            description: 'Updated kickoff',
            day: Day.SATURDAY,
            startTime: '10:30',
            endTime: '11:30',
            published: true,
            pointValue: 10,
          },
        } as UpdateEventRequest,
        standardUser,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('When an admin deletes an event', () => {
  test('Then, error null is returned', async () => {
    const adminUser = new UserModel();
    adminUser.accessType = UserAccessType.ADMIN;

    const controller = new EventController({
      deleteByUuid: jest.fn().mockResolvedValue(undefined),
    } as unknown as EventService);

    const result = await controller.deleteEvent(
      { uuid: 'event-1' } as UuidParam,
      adminUser,
    );

    expect(result).toEqual({ error: null });
  });
});

describe('When a standard user deletes an event', () => {
  test('Then, a ForbiddenError is thrown', async () => {
    const standardUser = new UserModel();
    standardUser.accessType = UserAccessType.STANDARD;

    const controller = new EventController({} as EventService);

    await expect(
      controller.deleteEvent(
        { uuid: 'event-1' } as UuidParam,
        standardUser,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});
