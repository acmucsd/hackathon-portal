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
  // TODO: upload and save resumes to s3
  resumeLink: string;
  willAttend: string;
  mlhCodeOfConduct: string;
  mlhAuthorization: string;
  mlhEmailAuthorization: string;
  additionalComments: string;
}

export interface CreateApplicationRequest {
  application: Application;
}

export interface UpdateApplicationRequest {
  application: Application;
}
