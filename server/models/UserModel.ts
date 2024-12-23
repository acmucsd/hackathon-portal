import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApplicationStatus, UserAccessType } from '../types/Enums';

@Entity()
export class UserModel {
  @PrimaryColumn()
  id: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

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
