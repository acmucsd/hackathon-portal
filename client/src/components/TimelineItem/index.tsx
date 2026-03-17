import Typography from '../Typography';
import styles from './style.module.scss';
import { PropsWithChildren } from 'react';
import CheckIcon from '@/../public/assets/icons/check.svg';

export const dateFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Los_Angeles',
  dateStyle: 'medium',
});

interface TimelineItemProps {
  /** In local time (America/Los_Angeles) */
  date: Date;
  ongoing?: boolean;
  first?: boolean;
  nextUpcoming?: boolean;
}

const TimelineItem = ({
  date,
  ongoing = false,
  first = false,
  nextUpcoming = false,
  children,
}: PropsWithChildren<TimelineItemProps>) => {
  const passed = !ongoing && new Date() >= date;

  return (
    <div className={`${styles.item} ${nextUpcoming ? styles.nextUpcoming : ''}`}>
      <div
        className={`${styles.circle} ${passed ? styles.complete : ''} ${
          first ? '' : styles.hasLine
        }`}
        aria-label={passed ? 'Date has passed.' : ongoing ? 'Ongoing date.' : 'Upcoming date.'}
      >
        {passed ? <CheckIcon aria-hidden /> : null}
      </div>
      <Typography variant="label/medium" component="span">
        {dateFormat.format(date)}: {children}
      </Typography>
    </div>
  );
};

export default TimelineItem;
