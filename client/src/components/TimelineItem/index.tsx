import Typography from '../Typography';
import styles from './style.module.scss';
import { PropsWithChildren } from 'react';
import CheckIcon from '@/../public/assets/icons/check.svg';

export const dateFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  dateStyle: 'medium',
});

interface TimelineItemProps {
  /** In UTC */
  date: Date;
  first?: boolean;
}

const TimelineItem = ({ date, first = false, children }: PropsWithChildren<TimelineItemProps>) => {
  const passed = new Date() >= date;

  return (
    <div className={styles.item}>
      <div
        className={`${styles.circle} ${passed ? styles.complete : ''} ${
          first ? '' : styles.hasLine
        }`}
        aria-label={passed ? 'Date has passed.' : 'Upcoming date.'}
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
