import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ApplicationStatus, UserAccessType } from '../types/Enums';
import { ResponseModel } from './ResponseModel';
import { Uid } from '../types/Internal';

@Entity('User')
export class UserModel {
  @PrimaryColumn()
  uid: Uid;

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

  @OneToMany((type) => ResponseModel, (response) => response.user, { cascade: true })
  response: ResponseModel;

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
