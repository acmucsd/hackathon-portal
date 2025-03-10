import {
  Allow,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import {
  CreateEventRequest as ICreateEventRequest,
  CreateEvent as ICreateEvent,
  UpdateEvent as IUpdateEvent,
  UpdateEventRequest as IUpdateEventRequest,
} from '../../types/ApiRequests';
import { EventType, Day } from '../../types/Enums';
import { Type } from 'class-transformer';

export class CreateEvent implements ICreateEvent {
  @IsDefined()
  @IsNotEmpty()
  name: string;

  @IsDefined()
  @IsEnum(EventType)
  type: EventType;

  @IsDefined()
  @IsNotEmpty()
  host: string;

  @IsDefined()
  @IsNotEmpty()
  location: string;

  @IsNotEmpty()
  locationLink?: string;

  @IsDefined()
  @IsNotEmpty()
  description: string;

  @IsDefined()
  @IsEnum(Day)
  day: Day;

  @IsDefined()
  @IsNotEmpty()
  startTime: string;

  @IsDefined()
  @IsNotEmpty()
  endTime: string;

  @IsDefined()
  published: boolean;
}

export class UpdateEvent implements IUpdateEvent {
  @IsNotEmpty()
  name: string;

  @IsEnum(EventType)
  type: EventType;

  @IsNotEmpty()
  host: string;

  @IsNotEmpty()
  location: string;

  @IsNotEmpty()
  locationLink?: string;

  @IsNotEmpty()
  description: string;

  @IsEnum(Day)
  day: Day;

  @IsNotEmpty()
  startTime: string;

  @IsNotEmpty()
  endTime: string;

  @Allow()
  published: boolean;
}

export class CreateEventRequest implements ICreateEventRequest {
  @Type(() => CreateEvent)
  @ValidateNested()
  @IsDefined()
  event: CreateEvent;
}

export class UpdateEventRequest implements IUpdateEventRequest {
  @Type(() => UpdateEvent)
  @ValidateNested()
  @IsDefined()
  event: UpdateEvent;
}
