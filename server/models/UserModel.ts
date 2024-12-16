import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApplicationStatus, UserAccessType } from '../types/Enums';

@Entity()
export class UserModel {
  @PrimaryColumn()
  uid: string;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserAccessType,
    default: UserAccessType.STANDARD,
  })
  accessType: UserAccessType;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.NOT_SUBMITTED,
  })
  applicationStatus: ApplicationStatus;

  public isRestricted(): boolean {
    return this.accessType === UserAccessType.RESTRICTED;
  }

  public isManager(): boolean {
    return this.accessType === UserAccessType.MANAGER;
  }

  public isAdmin(): boolean {
    return this.accessType === UserAccessType.ADMIN;
  }
}
