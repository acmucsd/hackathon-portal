import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EventModel } from './EventModel';
import { UserModel } from './UserModel';
import { PublicAttendance } from '../types/ApiResponses';

@Entity('Attendance')
export class AttendanceModel {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => UserModel, (user) => user.attendances)
  user: UserModel;

  @ManyToOne(() => EventModel, (event) => event.attendances)
  event: EventModel;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  public getPublicAttendance(): PublicAttendance {
    return {
      user: this.user.getPublicProfile(),
      event: this.event.getPublicEvent(),
      timestamp: this.timestamp,
    };
  }
}
