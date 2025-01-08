import Card from '../Card';
import Link from 'next/link';
import Heading from '../Heading';
import styles from './style.module.scss';
import Button from '../Button';
import { appQuestions } from '@/config';
import { Fragment } from 'react';

interface ApplicationReviewProps {
  responses: Record<string, string>;
  prev: string;
  next: string;
}

const ApplicationReview = ({ responses, prev, next }: ApplicationReviewProps) => {
  return (
    <Card gap={2}>
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
        <Button href={prev} variant="secondary">
          Make Changes
        </Button>
        <Button href={next}>Submit</Button>
      </div>
    </Card>
  );
};

export default ApplicationReview;
