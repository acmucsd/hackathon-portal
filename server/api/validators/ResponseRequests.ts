import {
  Allow,
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty,
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
  RSVP as IRSVP,
} from '../../types/Application';
import { IsLinkedinURL } from '../decorators/Validators';
import { Yes, YesOrNo } from '../../types/Enums';
import { Type } from 'class-transformer';

// because skipMissingProperties is enabled, everything is optional by default unless annotated with @IsDefined()
// because whitelist is enabled, annotate fields that don't have any other annotations with @Allow()
// to prevent them from being stripped off
export class Application implements IApplication {
  @IsDefined()
  @IsPhoneNumber()
  phoneNumber: string; //this IsPhoneNumber check is very strict, you need +country code in front

  @IsDefined()
  @IsNotEmpty()
  age: string;

  @IsDefined()
  @IsNotEmpty()
  university: string;

  @IsDefined()
  @IsNotEmpty()
  levelOfStudy: string;

  @IsDefined()
  @IsNotEmpty()
  country: string;

  @IsDefined()
  @IsNotEmpty()
  @IsUrl()
  @IsLinkedinURL()
  linkedin: string;

  @IsDefined()
  @IsNotEmpty()
  gender: string;

  @IsDefined()
  @IsNotEmpty()
  pronouns: string;

  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  @MinLength(1, { each: true })
  orientation: string[];

  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  @MinLength(1, { each: true })
  ethnicity: string[];

  // optional because no @IsDefined()
  @IsArray()
  dietary: string[];

  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  @MinLength(1, { each: true })
  interests: string[];

  @IsDefined()
  @IsNotEmpty()
  major: string;

  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  @MinLength(1, { each: true })
  referrer: string[];

  @IsDefined()
  @IsNotEmpty()
  motivation: string;

  @Allow() // will be converted into link when submitted
  resumeLink: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEnum(YesOrNo)
  willAttend: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEnum(Yes)
  mlhCodeOfConduct: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEnum(Yes)
  mlhAuthorization: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEnum(YesOrNo)
  mlhEmailAuthorization: string;

  @Allow()
  additionalComments: string;

  // ### Optional Demographic Fields (to MLH) ###
  @IsDefined()
  @IsNotEmpty()
  underrepresented: string;

  @IsDefined()
  @IsNotEmpty()
  educationLevel: string;

  @IsDefined()
  @IsNotEmpty()
  tshirtSize: string;

  @Allow()
  address1Shipping: string;

  @Allow()
  address2Shipping: string;

  @Allow()
  cityShipping: string;

  @Allow()
  stateShipping: string;

  @Allow()
  countryShipping: string;

  @Allow()
  zipcodeShipping: string;
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

export class RSVP implements IRSVP {
  @IsNotEmpty()
  willAttend: string;

  @IsNotEmpty()
  joinedDiscord: string;

  @Allow()
  additionalComments: string;
}
