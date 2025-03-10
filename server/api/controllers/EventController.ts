import {
  Body,
  Delete,
  ForbiddenError,
  Get,
  JsonController,
  Params,
  Patch,
  Post,
  UseBefore,
} from 'routing-controllers';
import { Service } from 'typedi';
import { EventService } from '../../services/EventService';
import { UserAuthentication } from '../middleware/UserAuthentication';
import {
  CreateEventRequest,
  UpdateEventRequest,
} from '../validators/EventControllerRequests';
import { AuthenticatedUser } from '../decorators/AuthenticatedUser';
import { UserModel } from '../../models/UserModel';
import {
  CreateEventResponse,
  DeleteEventResponse,
  GetAllEventsResponse,
  GetOneEventResponse,
  GetPublishedEventsResponse,
  UpdateEventResponse,
} from '../../types/ApiResponses';
import PermissionsService from '../../services/PermissionsService';
import { UuidParam } from '../validators/GenericRequests';

@JsonController('/event')
@Service()
export class EventController {
  private eventService: EventService;

  constructor(eventService: EventService) {
    this.eventService = eventService;
  }

  @UseBefore(UserAuthentication)
  @Post()
  async createEvent(
    @Body() createEventRequest: CreateEventRequest,
    @AuthenticatedUser() user: UserModel,
  ): Promise<CreateEventResponse> {
    if (!PermissionsService.canEditEvents(user)) throw new ForbiddenError();
    const event = await this.eventService.createEvent(createEventRequest.event);
    return { error: null, event: event.getPublicEvent() };
  }

  @UseBefore(UserAuthentication)
  @Get()
  async getAllEvents(
    @AuthenticatedUser() user: UserModel,
  ): Promise<GetAllEventsResponse> {
    if (!PermissionsService.canViewUnpublishedEvents(user))
      throw new ForbiddenError();
    const events = await this.eventService.getAllEvents();
    const publicEvents = events.map((e) => e.getPublicEvent());
    return { error: null, events: publicEvents };
  }

  @UseBefore(UserAuthentication)
  @Get()
  async getPublishedEvents(
    @AuthenticatedUser() user: UserModel,
  ): Promise<GetPublishedEventsResponse> {
    const events = await this.eventService.getPublishedEvents();
    const publicEvents = events.map((e) => e.getPublicEvent());
    return { error: null, events: publicEvents };
  }

  @UseBefore(UserAuthentication)
  @Get('/:uuid')
  async getOneEvent(
    @Params() params: UuidParam,
    @AuthenticatedUser() user: UserModel,
  ): Promise<GetOneEventResponse> {
    const event = await this.eventService.findByUuid(params.uuid);
    if (!event.published && !PermissionsService.canViewUnpublishedEvents(user))
      throw new ForbiddenError();
    return { error: null, event: event.getPublicEvent() };
  }

  @UseBefore(UserAuthentication)
  @Patch('/:uuid')
  async updateEvent(
    @Params() params: UuidParam,
    @Body() updateEventRequest: UpdateEventRequest,
    @AuthenticatedUser() user: UserModel,
  ): Promise<UpdateEventResponse> {
    if (!PermissionsService.canEditEvents(user)) throw new ForbiddenError();
    const event = await this.eventService.updateByUuid(
      params.uuid,
      updateEventRequest.event,
    );
    return { error: null, event: event.getPublicEvent() };
  }

  @UseBefore(UserAuthentication)
  @Delete('/:uuid')
  async deleteEvent(
    @Params() params: UuidParam,
    @AuthenticatedUser() user: UserModel,
  ): Promise<DeleteEventResponse> {
    if (!PermissionsService.canEditEvents(user)) throw new ForbiddenError();
    await this.eventService.deleteByUuid(params.uuid);
    return { error: null };
  }
}
