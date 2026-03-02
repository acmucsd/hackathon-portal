import Card from '@/components/Card';
import Typography from '@/components/Typography';
import StatusTag from '@/components/StatusTag';
import InterestFormTag from '@/components/InterestFormTag';
import Button from '@/components/Button';
import { RevieweeProfile } from '@/lib/types/apiResponses';
import { ApplicationStatus } from '@/lib/types/enums';
import styles from './style.module.scss';

interface UserItemProps {
  user: RevieweeProfile;
  superAdmin?: boolean;
}

const UserItem = ({ user, superAdmin }: UserItemProps) => {
  const date = new Date(user.createdAt);
  const formattedDate = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
  const displayStatus =
    user.applicationStatus === ApplicationStatus.SUBMITTED
      ? user.applicationDecision
      : user.applicationStatus;

  return (
    <Card gap={1} className={styles.container}>
      <Typography variant="title/small">
        {user.firstName} {user.lastName}
      </Typography>
      <StatusTag status={displayStatus} />
      <Typography variant="body/medium">School: {user.university || 'N/A'}</Typography>
      <Typography variant="body/medium">
        Interest Form: <InterestFormTag status={user.didInterestForm ? 'YES' : 'NO'} />
      </Typography>
      <Typography variant="body/medium">Submission Date: {formattedDate}</Typography>
      {superAdmin && (
        <Typography variant="body/medium">
          Assigned Reviewer:{' '}
          {user.reviewer ? `${user.reviewer.firstName} ${user.reviewer.lastName}` : 'Unassigned'}
        </Typography>
      )}
      {user.applicationStatus !== ApplicationStatus.NOT_SUBMITTED && (
        <Button
          className={styles.viewButton}
          href={`/applicationView/${user.id}`}
          variant="tertiary"
          openNewTab
        >
          View Application
        </Button>
      )}
    </Card>
  );
};

export default UserItem;
