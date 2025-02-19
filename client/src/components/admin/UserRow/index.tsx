import Button from '@/components/Button';
import StatusTag from '@/components/StatusTag';
import { PrivateProfile } from '@/lib/types/apiResponses';
import { ApplicationStatus } from '@/lib/types/enums';
import styles from './style.module.scss';

interface UserRowProps {
  user: PrivateProfile;
}

const UserRow = ({ user }: UserRowProps) => {
  const date = new Date(user.createdAt);
  const formattedDate = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
  return (
    <tr className={styles.tableRow}>
      <td>
        {user.firstName} {user.lastName}
      </td>
      <td>
        <StatusTag status={user.applicationStatus} />
      </td>
      <td>{formattedDate}</td>
      <td>
        {user.applicationStatus !== ApplicationStatus.NOT_SUBMITTED && (
          <Button
            className={styles.viewButton}
            href={`/applicationView/${user.id}`}
            variant="tertiary"
          >
            View Application
          </Button>
        )}
      </td>
    </tr>
  );
};

export default UserRow;
