import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UpdateApplicationDecisionRequest as IUpdateApplicationDecisionRequest } from '../../types/ApiRequests';
import { ApplicationDecision } from '../../types/Enums';
import { IsValidApplicationDecision } from '../decorators/Validators';

export class UpdateApplicationDecisionRequest implements IUpdateApplicationDecisionRequest {
  @IsDefined()
  @IsValidApplicationDecision()
  applicationDecision: ApplicationDecision;

  @IsOptional()
  @IsString()
  reviewerComments?: string | null;
}
