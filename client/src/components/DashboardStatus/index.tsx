import Typography from '../Typography';
import { Deadlines } from '../Dashboard';
import Button from '../Button';
import styles from './style.module.scss';

export type Status = 'not-started' | 'incomplete' | 'submitted' | 'accepted' | 'confirmed';

export const dateFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  dateStyle: 'full',
});

interface DashboardStatusProps {
  status: Status;
  timeline: Deadlines;
}

const DashboardStatus = ({ status, timeline }: DashboardStatusProps) => {
  // TODO
  return (
    <>
      <div className={`${styles.badge} ${styles[status]}`}>Status: {status.replace('-', ' ')}</div>
      <Typography variant="body/large" component="p">
        Our records have indicated that you have not started on your application. Click below to go
        on your hacker journey!
      </Typography>
      <Typography variant="body/large" component="p">
        Please note that applications are due on {dateFormat.format(timeline.application)}.
        Reference the hackathon timeline for more information.
      </Typography>
      {status === 'confirmed' ? (
        <Button href="/confirmation">View Confirmation</Button>
      ) : status === 'accepted' ? (
        <Button>Confirm Acceptance</Button>
      ) : (
        <Button href="/apply">
          {status === 'not-started'
            ? 'Apply Now'
            : status === 'incomplete'
            ? 'Continue Application'
            : 'Edit Application'}
        </Button>
      )}
    </>
  );
};

export default DashboardStatus;
