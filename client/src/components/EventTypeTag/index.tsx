import { formatTitleCase } from '@/lib/utils';
import { ApplicationStatus, ApplicationDecision } from '@/lib/types/enums';
import styles from './style.module.scss';

interface StatusTagProps {
  eventType: string;
}

const StatusTag = ({ eventType }: StatusTagProps) => {
  const formattedEventType = formatTitleCase(eventType);

  const displayStatus =
    eventType in ApplicationStatus || eventType in ApplicationDecision
      ? `${formattedEventType}`
      : formattedEventType;

  return <span className={`${styles.eventType} ${styles[eventType]}`}>{displayStatus}</span>;
};

export default StatusTag;
