'use client';

import Card from '../Card';
import Link from 'next/link';
import Heading from '../Heading';
import styles from './style.module.scss';
import Button from '../Button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResponseAPI } from '@/lib/api';
import showToast from '@/lib/showToast';
import { Application } from '@/lib/types/application';
import localforage from 'localforage';
import { SAVED_RESPONSES_KEY } from '../ApplicationStep';
import { Responses, responsesToApplication } from '../../lib/responses';
import ApplicationResponse from '../ApplicationResponse';

interface ApplicationReviewProps {
  accessToken: string;
  responses: Responses;
  responsesLoaded?: boolean;
  alreadySubmitted: boolean;
  prev: string;
  next: string;
  allowChanges: boolean;
}

const ApplicationReview = ({
  accessToken,
  responses,
  responsesLoaded = true,
  alreadySubmitted,
  prev,
  next,
  allowChanges,
}: ApplicationReviewProps) => {
  const router = useRouter();

  return (
    <Card
      gap={1.5}
      onSubmit={async e => {
        e.preventDefault();

        if (responses.mlhCodeOfConduct !== 'Yes') {
          showToast('Please agree to the MLH code of conduct.');
          return;
        }
        if (responses.mlhAuthorization !== 'Yes') {
          showToast('Please agree to the MLH terms and conditions.');
          return;
        }

        const application: Omit<Application, 'resumeLink'> = responsesToApplication(responses);
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

      <ApplicationResponse responses={responses} />

      {allowChanges ? (
        <div className={styles.buttonRow}>
          <Button href="/apply" variant="secondary">
            Make Changes
          </Button>
          <Button submit disabled={!responsesLoaded}>
            {alreadySubmitted ? 'Update' : 'Submit'}
          </Button>
        </div>
      ) : null}
    </Card>
  );
};

const ApplicationReviewWrapped = ({
  submittedResponses,
  ...props
}: Omit<ApplicationReviewProps, 'responses' | 'responsesLoaded' | 'alreadySubmitted'> & {
  submittedResponses?: Responses;
}) => {
  const [responses, setResponses] = useState<Responses>(submittedResponses ?? {});
  const [responsesLoaded, setResponsesLoaded] = useState(false);

  useEffect(() => {
    localforage
      .getItem<Responses | null>(SAVED_RESPONSES_KEY)
      .then(draftResponses => {
        if (draftResponses) {
          setResponses(submittedResponses => ({ ...submittedResponses, ...draftResponses }));
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
