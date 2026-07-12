import { validate } from 'class-validator';
import { Application } from '../../api/validators/ResponseRequests';

describe('When an application meets every validation requirement', () => {
  test('Then, validation accepts the application', async () => {
    const application = Object.assign(new Application(), {
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
      motivation: 'I want to build.',
      resumeLink: 'https://example.com/resume.pdf',
      willAttend: 'YES',
      additionalComments: 'No special requests.',
    });

    const errors = await validate(application);

    expect(errors).toHaveLength(0);
  });
});

describe('When an application omits its motivation', () => {
  test('Then, validation rejects the application', async () => {
    const application = Object.assign(new Application(), {
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
      resumeLink: 'https://example.com/resume.pdf',
      willAttend: 'YES',
      additionalComments: 'No special requests.',
    });

    const errors = await validate(application);

    expect(errors.some((error) => error.property === 'motivation')).toBe(true);
  });
});
