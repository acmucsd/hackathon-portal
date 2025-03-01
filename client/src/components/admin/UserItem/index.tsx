import Card from '@/components/Card';
import Typography from '@/components/Typography';
import StatusTag from '@/components/StatusTag';
import Button from '@/components/Button';
import { PrivateProfile } from '@/lib/types/apiResponses';
import { ApplicationStatus } from '@/lib/types/enums';
import styles from './style.module.scss';

interface UserItemProps {
  user: PrivateProfile;
}

const UserItem = ({ user }: UserItemProps) => {
  const date = new Date(user.createdAt);
  const formattedDate = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;

  return (
    <Card gap={1} className={styles.container}>
      <Typography variant="title/small">
        {user.firstName} {user.lastName}
      </Typography>
      <StatusTag status={user.applicationStatus} />
      <Typography variant="body/medium">Account Creation Date: {formattedDate}</Typography>
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
