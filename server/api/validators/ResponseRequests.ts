import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsUrl,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  Application as IApplication,
  CreateApplicationRequest as ICreateApplicationRequest,
  UpdateApplicationRequest as IUpdateApplicationRequest,
  Waiver as IWaiver,
} from '../../types/Application';
import { IsLinkedinURL } from '../decorators/Validators';
import { Yes, YesOrNo } from '../../types/Enums';
import { Type } from 'class-transformer';

export class Application implements IApplication {
  @IsPhoneNumber()
  phoneNumber: string;

  @IsNotEmpty()
  age: string;

  @IsNotEmpty()
  university: string;

  @IsNotEmpty()
  levelOfStudy: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  @IsUrl()
  @IsLinkedinURL()
  linkedin: string;

  @IsNotEmpty()
  gender: string;

  @IsNotEmpty()
  pronouns: string;

  @IsArray()
  @ArrayNotEmpty()
  @MinLength(1, { each: true })
  orientation: string[];

  @IsArray()
  @ArrayNotEmpty()
  @MinLength(1, { each: true })
  ethnicity: string[];

  @IsArray()
  @ArrayNotEmpty()
  @MinLength(1, { each: true })
  dietary: string[];

  @IsArray()
  @ArrayNotEmpty()
  @MinLength(1, { each: true })
  interests: string[];

  @IsNotEmpty()
  major: string;

  @IsArray()
  @ArrayNotEmpty()
  @MinLength(1, { each: true })
  referrer: string[];

  // TODO: replace with uploaded resume file instead
  @IsNotEmpty()
  resumeLink: string;

  @IsNotEmpty()
  @IsEnum(YesOrNo)
  willAttend: string;

  @IsNotEmpty()
  @IsEnum(Yes)
  mlhCodeOfConduct: string;

  @IsNotEmpty()
  @IsEnum(Yes)
  mlhAuthorization: string;

  @IsNotEmpty()
  @IsEnum(YesOrNo)
  mlhEmailAuthorization: string;

  @IsOptional()
  additionalComments: string;
}

export class CreateApplicationRequest implements ICreateApplicationRequest {
  @Type(() => Application)
  @ValidateNested()
  @IsDefined()
  application: Application;
}

export class UpdateApplicationRequest implements IUpdateApplicationRequest {
  @Type(() => Application)
  @ValidateNested()
  @IsDefined()
  application: Application;
}

export class Waiver implements IWaiver {
  @IsNotEmpty()
  participantName: string;

  @IsNotEmpty()
  dateOfBirth: string;

  @IsNotEmpty()
  signature: string;

  @IsNotEmpty()
  date: string;
}