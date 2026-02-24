import { IsDefined, IsOptional, IsString } from 'class-validator';
import { UpdateApplicationDecisionRequest as IUpdateApplicationDecisionRequest } from '../../types/ApiRequests';
import { ApplicationDecision } from '../../types/Enums';
import { IsValidApplicationDecision } from '../decorators/Validators';
import { IsBoolean } from 'class-validator';

export class UpdateApplicationDecisionRequest implements IUpdateApplicationDecisionRequest {
  @IsDefined()
  @IsValidApplicationDecision()
  applicationDecision: ApplicationDecision;

  @IsOptional()
  @IsString()
  reviewerComments?: string | null;
}

export class UpdateApplicationOpeningStatusRequest {
  @IsBoolean()
  applicationsOpen!: boolean;
}