import { IsDefined, IsEmail, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UpdateApplicationDecisionRequest as IUpdateApplicationDecisionRequest } from '../../types/ApiRequests';
import { UpdateUserAccessRequest as  IUpdateUserAccessRequest } from '../../types/ApiRequests';
import { ApplicationDecision, UserAccessType } from '../../types/Enums';
import { IsEduEmail, IsValidApplicationDecision } from '../decorators/Validators';

const AllowedRolesForUpdate = [
  UserAccessType.RESTRICTED,
  UserAccessType.STANDARD,
  UserAccessType.MANAGER,
  UserAccessType.ADMIN,
];

export class UpdateApplicationDecisionRequest implements IUpdateApplicationDecisionRequest {
  @IsDefined()
  @IsValidApplicationDecision()
  applicationDecision: ApplicationDecision;

  @IsOptional()
  @IsString()
  reviewerComments?: string | null;
}

export class UpdateUserAccessRequest implements IUpdateUserAccessRequest {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  @IsEduEmail()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsIn(AllowedRolesForUpdate)
  access: UserAccessType;

}
