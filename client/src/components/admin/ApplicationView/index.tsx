import Card from '@/components/Card';
import styles from './style.module.scss';
import Button from '@/components/Button';
import { appQuestions } from '@/config';
import { Fragment } from 'react';
import Heading from '@/components/Heading';

interface ApplicationViewProps {
  responses: Record<string, string | string[] | File | any>;
}

const ApplicationView = ({ responses }: ApplicationViewProps) => {
  return (
    <div>
      <Card gap={2}>
        <Heading>User Information</Heading>
        <dl className={styles.responseList}>
        <dt className={styles.question}>First Name</dt>
        <dd className={styles.response}>John</dd>
        <dt className={styles.question}>Last Name</dt>
        <dd className={styles.response}>Doe</dd>
        <dt className={styles.question}>Email Address</dt>
        <dd className={styles.response}>johndoe@ucsd.edu</dd>
        </dl>
      </Card>
      <Card gap={2}>
        <Heading>Application Submission</Heading>
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
    </div>
  );
};

export default ApplicationView;
