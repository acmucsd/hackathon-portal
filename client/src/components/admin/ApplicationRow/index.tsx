import Typography from '@/components/Typography';
import Button from '@/components/Button';
import StatusTag from '@/components/StatusTag';
import { PrivateProfile, ResponseModel } from '@/lib/types/apiResponses';
import styles from './style.module.scss';

interface ApplicationRowProps {
  application: ResponseModel;
}

const ApplicationRow = ({ application }: ApplicationRowProps) => {
  const date = new Date(application.createdAt);
  const formattedDate = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
  return (
    <tr className={styles.tableRow}>
      <td>
        {'John'} {'Doe'}
      </td>
      <td>
        <StatusTag status="Pending Review" />
      </td>
      <td>{formattedDate}</td>
      <td>
        <Button href="/applicationView" variant='tertiary'>View Application</Button>
      </td>
    </tr>
  );
};

export default ApplicationRow;
