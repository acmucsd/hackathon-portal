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
  const photoReleaseSubmitted = !!waivers.find(
    response => response.formType === FormType.PHOTO_RELEASE
  );
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
      showToast('CONFIRMED', 'Successfully marked the user as CONFIRMED');
      setCurrentStatus(updatedUser.applicationStatus);
    } catch (error) {
      reportError("Couldn't confirm user", error);
    }
  };

  return (
    <div className={styles.container}>
      <Card gap={2}>
        <Heading>User Information</Heading>
        <dl className={styles.responseList}>
          <dt className={styles.question}>First Name</dt>
          <dd className={styles.response}>{user.firstName}</dd>
          <dt className={styles.question}>Last Name</dt>
          <dd className={styles.response}>{user.lastName}</dd>
          <dt className={styles.question}>Email Address</dt>
          <dd className={styles.response}>{user.email}</dd>
          <dt className={styles.question}>Liability Waiver</dt>
          <dd className={styles.response}>
            <StatusTag
              status={
                liabilitySubmitted ? ApplicationStatus.SUBMITTED : ApplicationStatus.NOT_SUBMITTED
              }
            ></StatusTag>
          </dd>
          <dt className={styles.question}>Photo Release</dt>
          <dd className={styles.response}>
            <StatusTag
              status={
                photoReleaseSubmitted
                  ? ApplicationStatus.SUBMITTED
                  : ApplicationStatus.NOT_SUBMITTED
              }
            ></StatusTag>
          </dd>
        </dl>
      </Card>
      <Card gap={2}>
        <div className={styles.submissionHeader}>
          <Heading>Application Submission</Heading>
          <StatusTag status={currentDecision} />
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
                    <em>No response.</em>
                  )}
                </dd>
              </Fragment>
            ))}
        </dl>
      </Card>
      <hr className={styles.divider} />
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
