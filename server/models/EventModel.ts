import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Day, EventType } from '../types/Enums';
import { PublicEvent } from '../types/ApiResponses';

@Entity('Event')
export class EventModel {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column('enum', {
    enum: EventType,
  })
  type: EventType;

  @Column()
  host: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  locationLink: string;

  @Column()
  description: string;

  @Column('enum', {
    enum: Day,
  })
  day: Day;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  published: boolean;

  public getPublicEvent(): PublicEvent {
    return {
      uuid: this.uuid,
      name: this.name,
      type: this.type,
      host: this.host,
      location: this.location,
      locationLink: this.locationLink,
      description: this.description,
      day: this.day,
      startTime: this.startTime,
      endTime: this.endTime,
      published: this.published,
    };
  }
}
