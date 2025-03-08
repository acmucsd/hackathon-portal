'use client';
import Card from '@/components/Card';
import Heading from '@/components/Heading';
import StatusTag from '@/components/StatusTag';
import { AdminAPI } from '@/lib/api';
import { ResponseModel } from '@/lib/types/apiResponses';
import { ApplicationDecision } from '@/lib/types/enums';
import { reportError } from '@/lib/utils';
import showToast from '@/lib/showToast';
import { useState } from 'react';
import styles from './style.module.scss';
import ApplicationResponse from '@/components/ApplicationResponse';
import { applicationToResponses } from '@/lib/responses';
import Button from '@/components/Button';

interface ApplicationViewProps {
  application: ResponseModel;
  token: string;
  decision: ApplicationDecision;
}

const ApplicationView = ({ application, token, decision }: ApplicationViewProps) => {
  const responses: Record<string, string | string[] | File | any> = application.data;
  const user = application.user;
  const [currentDecision, setCurrentDecision] = useState(decision);

  const handleDecision = async (decision: ApplicationDecision) => {
    try {
      const updatedUser = await AdminAPI.updateApplicationDecision(token, user.id, decision);
      const updatedDecision = updatedUser.applicationDecision;
      setCurrentDecision(updatedDecision);
      showToast(`${updatedDecision}ED`, `You marked the application as "${updatedDecision}ED".`);
    } catch (error) {
      reportError("Couldn't update application decision", error);
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
        </dl>
      </Card>
      <Card gap={1.5}>
        <div className={styles.submissionHeader}>
          <Heading>Application Submission</Heading>
          <StatusTag status={currentDecision} />
        </div>
        <ApplicationResponse responses={applicationToResponses(application.data)} />
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
      </div>
    </div>
  );
};

export default ApplicationView;
