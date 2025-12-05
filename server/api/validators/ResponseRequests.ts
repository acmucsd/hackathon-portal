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
} from '../../types/Application';
import { IsLinkedinURL } from '../decorators/Validators';
import { Yes, YesOrNo } from '../../types/Enums';
import { Type } from 'class-transformer';

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

  @IsArray() // optional?
  @ArrayNotEmpty()
  @MinLength(1, { each: true })
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

  @IsNotEmpty() // temporarily optional until fully connected with frontend
  motivation: string;

  @IsNotEmpty() // will be converted into link when submitted
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

  @Allow() // optional
  additionalComments: string;

  // ### Optional Demographic Fields ###
  @IsDefined()
  underrepresented: string; // added

  @IsDefined()
  educationLevel: string; // added

  @IsDefined()
  tshirtSize: string; // added

  @IsDefined()
  address1Shipping: string; // added

  @IsDefined()
  address2Shipping: string; // added

  @IsDefined()
  cityShipping: string; // added

  @IsDefined()
  stateShipping: string; // added

  @IsDefined()
  countryShipping: string; // added
  
  @IsDefined()
  zipcodeShipping: string; // added  
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