import { YesOrNo, Yes } from './enums';

export interface Application {
  phoneNumber: string;
  age: string;
  university: string;
  levelOfStudy: string;
  country: string;
  linkedin: string;
  gender: string;
  pronouns: string;
  orientation: string[];
  ethnicity: string[];
  dietary: string[];
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
