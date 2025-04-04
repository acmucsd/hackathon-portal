import TableRow from '@/components/TableRow';
import TableCell from '@/components/TableCell';
import Button from '@/components/Button';
import StatusTag from '@/components/StatusTag';
import { FullProfile } from '@/lib/types/apiResponses';
import { ApplicationStatus } from '@/lib/types/enums';
import styles from './style.module.scss';

interface UserRowProps {
  user: FullProfile;
}

const UserRow = ({ user }: UserRowProps) => {
  const date = new Date(user.createdAt);
  const formattedDate = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
  const displayStatus =
    user.applicationStatus === ApplicationStatus.SUBMITTED
      ? user.applicationDecision
      : user.applicationStatus;
  return (
    <TableRow>
      <TableCell>
        {user.firstName} {user.lastName}
      </TableCell>
      <TableCell>
        <StatusTag status={displayStatus} />
      </TableCell>
      <TableCell className={styles.dateField}>{formattedDate}</TableCell>
      <TableCell>
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
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
