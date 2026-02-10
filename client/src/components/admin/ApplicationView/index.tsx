'use client';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { appQuestions } from '@/config';
import { Fragment } from 'react';
import Heading from '@/components/Heading';
import StatusTag from '@/components/StatusTag';
import { AdminAPI } from '@/lib/api';
import { ResponseModel } from '@/lib/types/apiResponses';
import { ApplicationDecision, ApplicationStatus, FormType } from '@/lib/types/enums';
import { reportError } from '@/lib/utils';
import showToast from '@/lib/showToast';
import { useState } from 'react';
import styles from './style.module.scss';
import Link from 'next/link';

interface ApplicationViewProps {
  application: ResponseModel;
  token: string;
  decision: ApplicationDecision;
  waivers: ResponseModel[];
}

const ApplicationView = ({ application, token, decision, waivers }: ApplicationViewProps) => {
  const responses: Record<string, string | string[] | File | any> = application.data;
  const user = application.user;
  const [currentDecision, setCurrentDecision] = useState(decision);
  const liabilitySubmitted = !!waivers.find(
    response => response.formType === FormType.LIABILITY_WAIVER
  );
  // const photoReleaseSubmitted = !!waivers.find(
  //   response => response.formType === FormType.PHOTO_RELEASE
  // );
  const [currentStatus, setCurrentStatus] = useState(user.applicationStatus);

  const handleDecision = async (decision: ApplicationDecision) => {
    if (currentStatus === ApplicationStatus.CONFIRMED) {
      showToast(
        "Couldn't update application decision",
        'User has already been confirmed for the hackathon.'
      );
      return;
    }
    try {
      const updatedUser = await AdminAPI.updateApplicationDecision(token, user.id, decision);
      const updatedDecision = updatedUser.applicationDecision;
      setCurrentDecision(updatedDecision);
      showToast(`${updatedDecision}ED`, `You marked the application as "${updatedDecision}ED".`);
    } catch (error) {
      reportError("Couldn't update application decision", error);
    }
  };

  const handleConfirmUser = async () => {
    if (currentDecision !== ApplicationDecision.ACCEPT) {
      showToast("Couldn't confirm user", "User hasn't been accepted to the hackathon.");
      return;
    }
    try {
      const updatedUser = await AdminAPI.confirmUserStatus(token, user.id);
      setCurrentStatus(updatedUser.applicationStatus);
      showToast('CONFIRMED', 'Successfully marked the user as CONFIRMED');
    } catch (error) {
      reportError("Couldn't confirm user", error);
    }
  };

  const NO_RESPONSE = "No response.";

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <Link href="/" className={styles.backLink}>
          {"< "}
          <span className={styles.backText}>Back to Dashboard</span>
        </Link>
      </div>

      {/* <hr className={styles.divider} /> */}
      <Card gap={2}>
        <h1 className={styles.heading}>Summary of Important Fields</h1>
        <dl className={styles.responseList}>
          <dt className={styles.question}>Name </dt>
          <dd className={styles.response}>{user.firstName} {user.lastName}</dd>
          <dt className={styles.question}>University</dt>
          <dd className={styles.response}>{application.data.university ?? NO_RESPONSE}</dd>
          <dt className={styles.question}>Age</dt>
          <dd className={styles.response}>{application.data.age ?? NO_RESPONSE}</dd>
          <dt className={styles.question}>Race/Ethnicity</dt>
          <dd className={styles.response}>{application.data.ethnicity ?? NO_RESPONSE}</dd>
          <dt className={styles.question}>Filled out interest form: </dt>
          <dd className={styles.response}>
            <StatusTag
              status={
                liabilitySubmitted ? ApplicationStatus.SUBMITTED : ApplicationStatus.NOT_SUBMITTED
              }
            ></StatusTag>
          </dd>
        </dl>
      </Card>
      <Card gap={2}>
        <div className={styles.submissionHeader}>
          <h1 className={styles.heading}>Application Submission</h1>
        </div>
        <dl className={styles.responseList}>
          {appQuestions
            .flatMap(step => step.questions)
            .map(({ id, question }) => (
              <Fragment key={id}>
                <dt className={styles.question}>{question}</dt>
                <dd className={styles.response}>
                  {typeof responses[id] === 'string' ? (
                    id === 'resumeLink' ? (
                      <Button variant="secondary" href={responses[id]}>
                        View Resume
                      </Button>
                    ) : (
                      responses[id]
                    )
                  ) : Array.isArray(responses[id]) ? (
                    responses[id].join(', ')
                  ) : (
                    <em>{NO_RESPONSE}</em>
                  )}
                </dd>
              </Fragment>
            ))}
        </dl>
      </Card>
      <div className={styles.decisionButtons}>
        <Button
          className={styles.reject}
          onClick={() => handleDecision(ApplicationDecision.REJECT)}
        >
          Reject
        </Button>
        <Button
          className={styles.waitlist}
          onClick={() => handleDecision(ApplicationDecision.WAITLIST)}
        >
          Waitlist
        </Button>
        <Button
          className={styles.accept}
          onClick={() => handleDecision(ApplicationDecision.ACCEPT)}
        >
          Accept
        </Button>
        <Button className={styles.accept} onClick={handleConfirmUser}>
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default ApplicationView;
