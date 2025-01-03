import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ResponseModel } from './ResponseModel';
import { ApplicationStatus, UserAccessType } from '../types/Enums';
import { PublicProfile, PrivateProfile } from '../types/ApiResponses';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany((type) => ResponseModel, (response) => response.user, {
    cascade: true,
  })
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

  public getPublicProfile(): PublicProfile {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
    };
  }

  public getPrivateProfile(): PrivateProfile {
    return {
      ...this.getPublicProfile(),
      email: this.email,
      accessType: this.accessType,
      applicationStatus: this.applicationStatus,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
