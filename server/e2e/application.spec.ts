import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { Config } from '../config';

const baseUrl = Config.testing.apiBaseUrl;
const authPath = Config.testing.authPath;

const { token } = JSON.parse(fs.readFileSync(authPath, 'utf8'));

const application = {
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

test.describe.configure({ mode: 'default' });


// Tests when applications are closed:

test('user is not able to get application without submititng application', async ({ request }) => {
  const response = await request.get(`${baseUrl}/response/application`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });



  expect(response.status()).not.toBe(200);
  expect(response.status()).toBe(404);

  const data = await response.json();


  expect(data).toBeTruthy();
  expect(data.error).toBeTruthy();
  expect(data.error.message).toBe('No application found for user');
});

test('user is not able to submit an application when applications are closed', async ({ request }) => {
  const response = await request.post(`${baseUrl}/response/application`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    multipart: {
      application: JSON.stringify(application),
      file: {
        name: 'resume.pdf',
        mimeType: 'application/pdf',
        buffer: fs.readFileSync(
          path.join(__dirname, 'fixtures', 'resume.pdf'),
        ),
      },
    },
  });

  expect(response.status()).not.toBe(200);
  expect(response.status()).toBe(403);

  const data = await response.json();

  expect(data).toBeTruthy();
  expect(data.error).toBeTruthy();
  expect(data.error.message).toBe('Applications are currently closed.');
});

test('user is not able to update their application when applications are closed', async ({ request }) => {
  const updatedApplication = {
    ...application,
    firstName: 'Jane',
  };

  const response = await request.patch(`${baseUrl}/response/application`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    multipart: {
      application: JSON.stringify(updatedApplication),
    },
  });

  expect(response.status()).not.toBe(200);
  expect(response.status()).toBe(403);

  const data = await response.json();

  expect(data).toBeTruthy();
  expect(data.error).toBeTruthy();
  expect(data.error.message).toBe('Applications are currently closed.');
});

test('user is unable to update their application with a new resume when applications are closed',
  async ({ request }) => {
  const response = await request.patch(`${baseUrl}/response/application`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    multipart: {
      application: JSON.stringify(application),
      file: {
        name: 'resume.pdf',
        mimeType: 'application/pdf',
        buffer: fs.readFileSync(
          path.join(__dirname, 'fixtures', 'resume.pdf'),
        ),
      },
    },
  });
  expect(response.status()).not.toBe(200);
  expect(response.status()).toBe(403);

  const data = await response.json();

  expect(data).toBeTruthy();
  expect(data.error).toBeTruthy();
  expect(data.error.message).toBe('Applications are currently closed.');
});

test('user is able to delete their application if no such application exists', async ({ request }) => {
  const response = await request.delete(`${baseUrl}/response/application`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  expect(response.status()).not.toBe(200);
  expect(response.status()).toBe(404);

  const data = await response.json();

  expect(data).toBeTruthy();
  expect(data.error).toBeTruthy();
  expect(data.error.message).toBe('No application found for user');
});


// todo: tests when applications are open (will setup later to have a toggle just for testing purposes)
