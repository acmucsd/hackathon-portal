import Typography from '../Typography';
import { Deadlines } from '../Dashboard';
import Button from '../Button';
import styles from './style.module.scss';

export type Status =
  | 'NOT_SUBMITTED'
  | 'SUBMITTED'
  | 'WITHDRAWN'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CONFIRMED';

export const dateFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  dateStyle: 'full',
});

interface DashboardStatusProps {
  status: Status;
  timeline: Deadlines;
}

const statusText = (status: string) => {
  const formatted = status.replace('_', ' ').toLowerCase();
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

const DashboardStatus = ({ status, timeline }: DashboardStatusProps) => {
  // TODO
  return (
    <>
      <div className={`${styles.badge} ${styles[status]}`}>Status: {statusText(status)}</div>
      <Typography variant="body/large" component="p">
        Our records have indicated that you have not started on your application. Click below to go
        on your hacker journey!
      </Typography>
      <Typography variant="body/large" component="p">
        Please note that applications are due on {dateFormat.format(timeline.application)}.
        Reference the hackathon timeline for more information.
      </Typography>
      {status === 'CONFIRMED' ? (
        <Button href="/confirmation">View Confirmation</Button>
      ) : status === 'ACCEPTED' ? (
        <Button>Confirm Acceptance</Button>
      ) : status === 'NOT_SUBMITTED' ? (
        <Button href="/apply">Apply Now</Button>
      ) : null}
    </>
  );
};

export default DashboardStatus;
