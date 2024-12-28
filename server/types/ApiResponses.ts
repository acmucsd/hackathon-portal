import { ApplicationStatus, UserAccessType } from './Enums';

export interface PublicProfile {
  id: string;
  firstName: string;
  lastName: string;
}

export interface PrivateProfile extends PublicProfile {
  email: string;
  accessType: UserAccessType;
  applicationStatus: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}
