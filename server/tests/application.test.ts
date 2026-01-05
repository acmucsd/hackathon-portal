import 'reflect-metadata';
import { validate } from 'class-validator';
import { Application } from '../api/validators/ResponseRequests';

const VALID_APPLICATION = {
  age: '19',
  phoneNumber: '+18563188585',
  university: 'University of California, San Diego',
  levelOfStudy: 'Undergraduate University (3+ year)',
  country: 'United States',
  linkedin: 'https://www.linkedin.com/in/example-andrew-zhang/',
  mlhCodeOfConduct: 'YES',
  mlhAuthorization: 'YES',
  mlhEmailAuthorization: 'NO',
  dietary: ['None'],
  underrepresented: 'No',
  gender: 'Man',
  pronouns: 'He/Him',
  ethnicity: ['Asian'],
  orientation: ['Heterosexual or straight'],
  educationLevel: 'Undergraduate University (3+ year)',
  tshirtSize: 'M',
  address1Shipping: '1234 Sample St',
  address2Shipping: 'Apt 567',
  cityShipping: 'San Diego',
  stateShipping: 'CA',
  countryShipping: 'United States',
  zipcodeShipping: '92092',
  major: 'Computer science, computer engineering, or software engineering',
  interests: ['AI', 'Web Development', 'Hackathons'],
  referrer: ['Friend', 'ACM UCSD'],
  motivation: '__INTEGRATION_TEST__',
  resumeLink: 'https://example.com/resume.pdf',
  willAttend: 'YES',
  additionalComments: 'No special requests. Excited to join!',
};

const INVALID_APPLICATION = {
  age: '19',
  phoneNumber: '+18563188585',
  university: 'University of California, San Diego',
  levelOfStudy: 'Undergraduate University (3+ year)',
  country: 'United States',
  linkedin: 'https://www.linkedin.com/in/example-andrew-zhang/',
  mlhCodeOfConduct: 'YES',
  mlhAuthorization: 'YES',
  mlhEmailAuthorization: 'NO',
  dietary: ['None'],
  underrepresented: 'No',
  gender: 'Man',
  pronouns: 'He/Him',
  ethnicity: ['Asian'],
  orientation: ['Heterosexual or straight'],
  educationLevel: 'Undergraduate University (3+ year)',
  tshirtSize: 'M',
  address1Shipping: '1234 Sample St',
  cityShipping: 'San Diego',
  stateShipping: 'CA',
  countryShipping: 'United States',
  zipcodeShipping: '92092',
  major: 'Computer science, computer engineering, or software engineering',
  interests: ['AI', 'Web Development', 'Hackathons'],
  referrer: ['Friend', 'ACM UCSD'],
  motivation: '__INTEGRATION_TEST__',
  resumeLink: 'https://example.com/resume.pdf',
  willAttend: 'YES',
  additionalComments: 'No special requests. Excited to join!',
};
// missing address2Shipping field

describe('Application Validation', () => {
  it('should validate a correct application', async () => {
    const application = Object.assign(new Application(), VALID_APPLICATION);
    const errors = await validate(application);
    expect(errors.length).toBe(0);
  });
});

describe('Application Validation', () => {
  it('should invalidate an incorrect application', async () => {
    const application = Object.assign(new Application(), INVALID_APPLICATION);
    const errors = await validate(application);
    expect(errors.length).toBeGreaterThan(0);
  });
});
