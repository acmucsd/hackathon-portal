import { ApplicationStatus } from '@/lib/types/enums';
import styles from './style.module.scss';

interface StatusTagProps {
  status: ApplicationStatus;
}

const StatusTag = ({ status }: StatusTagProps) => (
  <span className={`${styles.status} ${styles[status]}`}>
    Status:{' '}
    {status
      .replace('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase())}
  </span>
);

export default StatusTag;
