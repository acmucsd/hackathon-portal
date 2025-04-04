import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ResponseModel } from './ResponseModel';
import {
  ApplicationDecision,
  ApplicationStatus,
  UserAccessType,
} from '../types/Enums';
import {
  PublicProfile,
  PrivateProfile,
  HiddenProfile,
} from '../types/ApiResponses';
import { AttendanceModel } from './AttendanceModel';

@Entity('User')
export class UserModel {
  @PrimaryColumn()
  id: string;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column('enum', {
    enum: UserAccessType,
    default: UserAccessType.STANDARD,
  })
  accessType: UserAccessType;

  @Column('enum', {
    enum: ApplicationStatus,
    default: ApplicationStatus.NOT_SUBMITTED,
  })
  applicationStatus: ApplicationStatus;

  @Column('enum', {
    enum: ApplicationDecision,
    default: ApplicationDecision.NO_DECISION,
  })
  applicationDecision: ApplicationDecision;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany((type) => ResponseModel, (response) => response.user, {
    cascade: true,
  })
  responses: ResponseModel;

  @OneToMany((type) => AttendanceModel, (attendance) => attendance.user, { cascade: true })
  attendances: AttendanceModel[];

  public isRestricted(): boolean {
    return this.accessType === UserAccessType.RESTRICTED;
  }

  public isManager(): boolean {
    return this.accessType === UserAccessType.MANAGER;
  }

  public isAdmin(): boolean {
    return this.accessType === UserAccessType.ADMIN;
  }

  public getPublicProfile(): PublicProfile {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
    };
  }

  public getPrivateProfile(): PrivateProfile {
    const privateProfile: PrivateProfile = {
      ...this.getPublicProfile(),
      email: this.email,
      accessType: this.accessType,
      applicationStatus: this.applicationStatus,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
    if (this.responses) privateProfile.responses = this.responses;
    return privateProfile;
  }

  public getHiddenProfile(): HiddenProfile {
    return {
      ...this.getPrivateProfile(),
      applicationDecision: this.applicationDecision,
    };
  }
}
