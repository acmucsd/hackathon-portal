'use client';

import Card from '../Card';
import Link from 'next/link';
import Heading from '../Heading';
import styles from './style.module.scss';
import Button from '../Button';
import { appQuestions } from '@/config';
import { Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { ResponseAPI } from '@/lib/api';
import { Yes, YesOrNo } from '@/lib/types/enums';
import showToast from '@/lib/showToast';
import { Application } from '@/lib/types/application';

interface ApplicationReviewProps {
  accessToken: string;
  responses: Record<string, string>;
  prev: string;
  next: string;
}

const ApplicationReview = ({ accessToken, responses, prev, next }: ApplicationReviewProps) => {
  const router = useRouter();

  return (
    <Card
      gap={2}
      onSubmit={async e => {
        e.preventDefault();

        const application: Application = {
          phoneNumber: '+12345678900',
          age: 'meow',
          university: 'meow',
          levelOfStudy: 'meow',
          country: 'meow',
          linkedin: 'https://www.linkedin.com/in/yen-sean/',
          gender: 'meow',
          pronouns: 'meow',
          orientation: ['meow'],
          ethnicity: ['meow'],
          dietary: ['meow'],
          interests: ['meow'],
          major: 'meow',
          referrer: ['meow'],
          resumeLink: 'meow??',
          willAttend: YesOrNo.YES,
          mlhCodeOfConduct: Yes.YES,
          mlhAuthorization: Yes.YES,
          mlhEmailAuthorization: YesOrNo.YES,
          additionalComments: '',
        };
        // Files can't be passed to a server action but FormData can
        const formData = new FormData();
        formData.append('application', JSON.stringify(application));
        formData.append('file', new File([], 'hello.pdf'));

        const result = await ResponseAPI.submitApplication(accessToken, formData);
        if ('error' in result) {
          showToast("Couldn't submit application", result.error);
          return;
        }

        router.push(next);
      }}
    >
      <Link href={prev}>&lt; Back</Link>
      <Heading>Application Review</Heading>

      <dl>
        {appQuestions
          .flatMap(step => step.questions)
          .map(({ id, question }) => (
            <Fragment key={id}>
              <dt className={styles.question}>{question}</dt>
              <dd className={styles.response}>{responses[id] ?? 'No response.'}</dd>
            </Fragment>
          ))}
      </dl>

      <div className={styles.buttonRow}>
        <Button href="/apply" variant="secondary">
          Make Changes
        </Button>
        <Button submit>Submit</Button>
      </div>
    </Card>
  );
};

export default ApplicationReview;
