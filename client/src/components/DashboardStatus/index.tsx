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
  timeZone: 'America/Los_Angeles',
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

const getStatusDescription = (timeline: Deadlines, status: Status) => {
  switch (status) {
    case 'SUBMITTED':
      return 'Congrats on applying to DiamondHacks!';
    case 'ACCEPTED':
    case 'CONFIRMED':
      return 'Congrats on your acceptance to DiamondHacks! Make sure to fill out your waivers on the Profile page and the RSVP form sent to your email!';
    default:
      if (new Date() < timeline.application) {
        return 'Our records have indicated that you have not started on your application. Click below to go on your hacker journey!';
      } else {
        return "Our records have indicated that you have not started on your application. Unfortunately, the deadline has passed, but we'd love to see you next year at DiamondHacks!";
      }
  }
};

const DashboardStatus = ({ status, timeline }: DashboardStatusProps) => {
  // TODO
  return (
    <>
      <div className={`${styles.badge} ${styles[status]}`}>Status: {statusText(status)}</div>
      <Typography variant="body/large" component="p">
        {getStatusDescription(timeline, status)}
      </Typography>
      {new Date() < timeline.application ? (
        <Typography variant="body/large" component="p">
          Please note that applications are due on {dateFormat.format(timeline.application)}.
          Reference the hackathon timeline for more information.
        </Typography>
      ) : null}

      {status === 'CONFIRMED' ? (
        <Button href="/confirmation">View Confirmation</Button>
      ) : status === 'NOT_SUBMITTED' ? (
        new Date() < timeline.application ? (
          <Button href="/apply">Apply Now</Button>
        ) : null
      ) : status === 'SUBMITTED' ? (
        <Button href="/apply">
          {new Date() < timeline.application ? 'Edit Application' : 'View Application'}
        </Button>
      ) : null}
    </>
  );
};

export default DashboardStatus;
