export interface Application {
  //link to Hackathon Organizers Guide:
  //https://guide.mlh.io/general-information/managing-registrations/registrations#important-registration-fields
  //(Some of following are multiple-choice questions, and options are in this guide.)

  // ### Important Registration Fields ###
  // firstName: string; from user model
  // lastName: string; from user model
  // email: string; from user model
  age: string;
  phoneNumber: string;
  university: string;
  levelOfStudy: string;
  country: string;
  linkedin: string;

  // ### MLH Checkboxes ###
  mlhCodeOfConduct: string;
  mlhAuthorization: string;
  mlhEmailAuthorization: string;

  // ### Optional Demographic Fields ###
  dietary: string[];
  underrepresented: string;
  gender: string;
  pronouns: string;
  ethnicity: string[];
  orientation: string[];
  educationLevel: string;
  tshirtSize: string;
  address1Shipping: string;
  address2Shipping: string;
  cityShipping: string;
  stateShipping: string;
  countryShipping: string;
  zipcodeShipping: string;
  major: string;

  // ### Not in official requirements list ###
  interests: string[];
  referrer: string[];
  motivation: string;
  resumeLink: string;
  willAttend: string;
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

export interface RSVP {
  willAttend: string;
  joinedDiscord: string;
  additionalComments: string;
}
