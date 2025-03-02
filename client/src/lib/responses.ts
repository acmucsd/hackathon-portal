import { Application } from '@/lib/types/application';
import { YesOrNo, Yes } from '@/lib/types/enums';

export type Responses = Record<string, string | string[] | File | any>;

export function applicationToResponses(application: Application): Responses {
  return {
    ...application,
    willAttend: application.willAttend === YesOrNo.YES ? 'Yes' : 'No',
    mlhCodeOfConduct: application.mlhCodeOfConduct === Yes.YES ? 'Yes' : 'No',
    mlhAuthorization: application.mlhAuthorization === Yes.YES ? 'Yes' : 'No',
    mlhEmailAuthorization: application.mlhEmailAuthorization === YesOrNo.YES ? 'Yes' : 'No',
  };
}

export function responsesToApplication(responses: Responses): Omit<Application, 'resumeLink'> {
  return {
    phoneNumber: (responses.phoneNumber as string).startsWith('+')
      ? responses.phoneNumber
      : `+${responses.phoneNumber}`,
    age: responses.age,
    university: responses.university,
    levelOfStudy: responses.levelOfStudy,
    country: responses.country,
    linkedin: responses.linkedin,
    gender: responses.gender,
    pronouns: responses.pronouns,
    orientation: responses.orientation,
    ethnicity: responses.ethnicity,
    dietary: ['Will be answered in follow-up form.'],
    interests: responses.interests,
    major: responses.major,
    referrer: responses.referrer,
    motivation: responses.motivation,
    willAttend: responses.willAttend === 'Yes' ? YesOrNo.YES : YesOrNo.NO,
    mlhCodeOfConduct: Yes.YES,
    mlhAuthorization: Yes.YES,
    mlhEmailAuthorization: responses.mlhEmailAuthorization === 'Yes' ? YesOrNo.YES : YesOrNo.NO,
    additionalComments: responses.additionalComments,
  };
}
