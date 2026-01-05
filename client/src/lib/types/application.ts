import { YesOrNo, Yes } from './enums';

export interface Application {
  phoneNumber: string;
  age: string;
  university: string;
  educationLevel: string;
  levelOfStudy: string;
  country: string;
  linkedin: string;
  gender: string;
  pronouns: string;
  orientation: string[];
  ethnicity: string[];
  underrepresented: string;
  dietary: string[];
  tshirtSize: string;
  address1Shipping: string;
  address2Shipping: string;
  cityShipping: string;
  stateShipping: string;
  countryShipping: string;
  zipcodeShipping: string;
  interests: string[];
  major: string;
  referrer: string[];
  motivation: string;
  resumeLink: string;
  willAttend: YesOrNo;
  mlhCodeOfConduct: Yes;
  mlhAuthorization: Yes;
  mlhEmailAuthorization: YesOrNo;
  additionalComments: string;
}
export interface CreateApplicationRequest {
  application: Application;
}

export interface UpdateApplicationRequest {
  application: Application;
}

export interface Waiver {
  participantName: string;
  dateOfBirth: string;
  signature: string;
  date: string;
}
