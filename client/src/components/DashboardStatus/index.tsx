import Typography from '../Typography';
import { Deadlines } from '../Dashboard';
import Button from '../Button';
import styles from './style.module.scss';
import { ApplicationStatus } from '@/lib/types/enums';

export type Status = ApplicationStatus;

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
      return 'Congrats on your acceptance to DiamondHacks! Make sure to fill out the required forms in the Onboarding Tasks section to secure your spot at the event. You must fill out at least the RSVP form by 3/13 to be confirmed for the event or your spot will be forfeited to people on the waitlist.';
    case 'CONFIRMED':
      return "Your place at DiamondHacks has been confirmed! 🪄✨ We're thrilled to welcome you to a weekend of creativity, innovation, and a little bit of magic on April 4–5.\n\nGather your ideas, prepare your spells (or code), and get ready to collaborate with fellow wizards and innovators as you build something extraordinary. We can't wait to see what you'll create when the magic begins!";
    case 'WAITLISTED':
      return 'You have been waitlisted for DiamondHacks. We will notify you if a spot becomes available starting 3/14.';
    case 'REJECTED':
      return 'Thank you for applying to DiamondHacks! Unfortunately, we are unable to offer you a spot this year. We hope to see you next year!';
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
          Please note that applications are due on{' '}
          <span className={styles.urgentDate}> {dateFormat.format(timeline.application)} </span>.
          Reference the hackathon timeline for more information.
        </Typography>
      ) : null}

      {status === 'NOT_SUBMITTED' ? (
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
