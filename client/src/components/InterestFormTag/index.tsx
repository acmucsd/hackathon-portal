import { formatTitleCase } from '@/lib/utils';
import { ApplicationStatus, ApplicationDecision } from '@/lib/types/enums';
import styles from './style.module.scss';

interface InterestFormTagProps {
  status: string;
}

const InterestFormTag = ({ status }: InterestFormTagProps) => {
  const formattedStatus = formatTitleCase(status);

  const displayStatus =
    status in ApplicationStatus || status in ApplicationDecision
      ? `Status: ${formattedStatus}`
      : formattedStatus;

  return <span className={`${styles.status} ${styles[status]}`}>{displayStatus}</span>;
};

export default InterestFormTag;
