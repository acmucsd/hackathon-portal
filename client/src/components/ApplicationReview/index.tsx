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
  alreadySubmitted: boolean;
  prev: string;
  next: string;
}

const ApplicationReview = ({
  accessToken,
  responses,
  responsesLoaded = true,
  alreadySubmitted,
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

        const application: Omit<Application, 'resumeLink'> = {
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
          willAttend: responses.willAttend === 'Yes' ? YesOrNo.YES : YesOrNo.NO,
          mlhCodeOfConduct: Yes.YES,
          mlhAuthorization: Yes.YES,
          mlhEmailAuthorization:
            responses.mlhEmailAuthorization === 'Yes' ? YesOrNo.YES : YesOrNo.NO,
          additionalComments: responses.additionalComments,
        };
        for (const key of Object.keys(responses)) {
          if (key !== 'resumeLink' && !Object.hasOwn(application, key)) {
            console.warn(`Application has unused question '${key}'`);
          }
        }
        // Files can't be passed to a server action but FormData can
        const formData = new FormData();
        formData.append('application', JSON.stringify(application));
        if (responses.resumeLink instanceof File) {
          formData.append('file', responses.resumeLink);
        }

        if (alreadySubmitted) {
          const result = await ResponseAPI.updateApplication(accessToken, formData);
          if ('error' in result) {
            showToast("Couldn't resubmit application", result.error);
            return;
          }
        } else {
          const result = await ResponseAPI.submitApplication(accessToken, formData);
          if ('error' in result) {
            showToast("Couldn't submit application", result.error);
            return;
          }
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
          {alreadySubmitted ? 'Update' : 'Submit'}
        </Button>
      </div>
    </Card>
  );
};

const ApplicationReviewWrapped = ({
  submittedResponses,
  ...props
}: Omit<ApplicationReviewProps, 'responses' | 'responsesLoaded' | 'alreadySubmitted'> & {
  submittedResponses?: Record<string, string | string[] | any>;
}) => {
  const [responses, setResponses] = useState<Record<string, string | string[] | File | any>>(
    submittedResponses ?? {}
  );
  const [responsesLoaded, setResponsesLoaded] = useState(false);

  useEffect(() => {
    localforage
      .getItem<SavedResponses | null>(SAVED_RESPONSES_KEY)
      .then(draftResponses => {
        if (draftResponses) {
          setResponses({ ...submittedResponses, ...draftResponses });
        }
      })
      .finally(() => setResponsesLoaded(true));
  }, []);

  return (
    <ApplicationReview
      {...props}
      responses={responses}
      responsesLoaded={responsesLoaded}
      alreadySubmitted={submittedResponses !== undefined}
    />
  );
};

export default ApplicationReviewWrapped;
