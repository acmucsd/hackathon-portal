import Card from '@/components/Card';
import Typography from '@/components/Typography';
import StatusTag from '@/components/StatusTag';
import Button from '@/components/Button';
import { FullProfile } from '@/lib/types/apiResponses';
import { ApplicationStatus } from '@/lib/types/enums';
import styles from './style.module.scss';

interface UserItemProps {
  user: FullProfile;
  superAdmin: boolean;
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
      <Typography variant="body/medium">Account Creation Date: {formattedDate}</Typography>
      {superAdmin && (
        <Typography variant="body/medium">Assigned Reviewer: {"Assigned Reviewer Placeholder"}</Typography>
      )}
      {user.applicationStatus !== ApplicationStatus.NOT_SUBMITTED && (
        <Button
          className={styles.viewButton}
          href={`/applicationView/${user.id}`}
          variant="tertiary"
        >
          View Application
        </Button>
      )}
    </Card>
  );
};

export default UserItem;
