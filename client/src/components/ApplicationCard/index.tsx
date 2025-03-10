'use client';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Heading from '@/components/Heading';
import StatusTag from '@/components/StatusTag';
import { appQuestions } from '@/config';
import { Fragment, useState } from 'react';
import { ResponseModel } from '@/lib/types/apiResponses';
import { ApplicationStatus } from '@/lib/types/enums';
import styles from './style.module.scss';

interface ApplicationCardProps {
  application: ResponseModel;
  applicationStatus: ApplicationStatus;
  className?: string;
}

const ApplicationCard = ({ application, applicationStatus, className }: ApplicationCardProps) => {
  const responses: Record<string, string | string[] | File | any> = application.data;
  const [expanded, setExpanded] = useState(false);

  return (
    <Card gap={2} className={className}>
      <div className={styles.submissionHeader}>
        <Heading>Application Submission</Heading>
        <StatusTag status={applicationStatus} />
      </div>
      <div
        className={`${styles.responseContainer} ${expanded ? styles.expanded : styles.collapsed}`}
      >
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
      </div>
      <Button variant="tertiary" onClick={() => setExpanded(!expanded)}>
        {expanded ? 'See Less' : 'See More'}
      </Button>
    </Card>
  );
};

export default ApplicationCard;
