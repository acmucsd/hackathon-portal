import Card from '@/components/Card';
import Heading from '@/components/Heading';
import { ResponseModel } from '@/lib/types/apiResponses';
import styles from './style.module.scss';
import ApplicationResponse from '@/components/ApplicationResponse';
import { applicationToResponses } from '@/lib/responses';

interface ApplicationViewProps {
  application: ResponseModel;
}

const ApplicationView = ({ application }: ApplicationViewProps) => {
  const user = application.user;
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
        <Heading>Application Submission</Heading>
        <ApplicationResponse responses={applicationToResponses(application.data)} />
      </Card>
    </div>
  );
};

export default ApplicationView;
