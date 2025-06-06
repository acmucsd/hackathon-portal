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


export interface Waiver {
  participantName: string;
  dateOfBirth: string;
  signature: string;
  date: string;
}
