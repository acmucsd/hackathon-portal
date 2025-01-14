'use client';

import Card from '../Card';
import Link from 'next/link';
import Heading from '../Heading';
import styles from './style.module.scss';
import Button from '../Button';
import { appQuestions } from '@/config';
import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResponseAPI } from '@/lib/api';
import { Yes, YesOrNo } from '@/lib/types/enums';
import showToast from '@/lib/showToast';
import { Application } from '@/lib/types/application';
import localforage from 'localforage';
import { SavedResponses, SAVED_RESPONSES_KEY } from '../ApplicationStep';

interface ApplicationReviewProps {
  accessToken: string;
  responses: Record<string, string | string[] | File | any>;
  responsesLoaded?: boolean;
  prev: string;
  next: string;
}

const ApplicationReview = ({
  accessToken,
  responses,
  responsesLoaded = true,
  prev,
  next,
}: ApplicationReviewProps) => {
  const router = useRouter();

  return (
    <Card
      gap={2}
      onSubmit={async e => {
        e.preventDefault();

        if (
          !confirm(
            'Are you sure you want to submit? You currently will not be able to edit your application after submitting.'
          )
        ) {
          return;
        }

        if (responses.mlhCodeOfConduct !== 'Yes') {
          showToast('Please agree to the MLH code of conduct.');
          return;
        }
        if (responses.mlhAuthorization !== 'Yes') {
          showToast('Please agree to the MLH terms and conditions.');
          return;
        }

        const application: Application = {
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
          resumeLink: 'This will be populated by the backend',
          willAttend: responses.willAttend === 'Yes' ? YesOrNo.YES : YesOrNo.NO,
          mlhCodeOfConduct: Yes.YES,
          mlhAuthorization: Yes.YES,
          mlhEmailAuthorization:
            responses.mlhEmailAuthorization === 'Yes' ? YesOrNo.YES : YesOrNo.NO,
          additionalComments: responses.additionalComments,
        };
        // Files can't be passed to a server action but FormData can
        const formData = new FormData();
        formData.append('application', JSON.stringify(application));
        formData.append('file', responses.resumeLink);

        const result = await ResponseAPI.submitApplication(accessToken, formData);
        if ('error' in result) {
          showToast("Couldn't submit application", result.error);
          return;
        }

        // Remove saved data
        await localforage.removeItem(SAVED_RESPONSES_KEY);

        router.refresh();
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
              <dd className={styles.response}>
                {typeof responses[id] === 'string' ? (
                  responses[id]
                ) : Array.isArray(responses[id]) ? (
                  responses[id].join(', ')
                ) : responses[id] instanceof File ? (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const link = document.createElement('a');
                      const url = URL.createObjectURL(responses[id]);
                      link.href = url;
                      link.download = responses[id].name;
                      document.body.append(link);
                      link.click();
                      link.remove();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    {responses[id].name}
                  </Button>
                ) : (
                  <em>No response.</em>
                )}
              </dd>
            </Fragment>
          ))}
      </dl>

      <div className={styles.buttonRow}>
        <Button href="/apply" variant="secondary">
          Make Changes
        </Button>
        <Button submit disabled={!responsesLoaded}>
          Submit
        </Button>
      </div>
    </Card>
  );
};

const ApplicationReviewWrapped = (
  props: Omit<ApplicationReviewProps, 'responses' | 'responsesLoaded'>
) => {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [responsesLoaded, setResponsesLoaded] = useState(false);

  useEffect(() => {
    localforage
      .getItem<SavedResponses | null>(SAVED_RESPONSES_KEY)
      .then(responses => {
        if (responses) {
          setResponses(responses);
        }
      })
      .finally(() => setResponsesLoaded(true));
  }, []);

  return <ApplicationReview {...props} responses={responses} responsesLoaded={responsesLoaded} />;
};

export default ApplicationReviewWrapped;
