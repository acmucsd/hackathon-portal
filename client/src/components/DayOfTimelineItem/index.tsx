import Typography from '../Typography';
import styles from './style.module.scss';
import { PropsWithChildren } from 'react';
import DayOfTimelineCard from '@/components/DayOfTimelineCard';
import { PublicEvent } from '@/lib/types/apiResponses';
import { formatTime } from '@/lib/utils';

export const dateFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Los_Angeles',
  dateStyle: 'medium',
});

interface DayOfTimelineItemProps {
  /** In local time (America/Los_Angeles) */
  event: PublicEvent;
  ongoing?: boolean;
  last?: boolean;
  nextUpcoming?: boolean;
}

const TimelineItem = ({
  event,
  ongoing = false,
  last = false,
  nextUpcoming = false,
  children,
}: PropsWithChildren<DayOfTimelineItemProps>) => {
  return (
    <div className={`${styles.item} ${nextUpcoming ? styles.nextUpcoming : ''}`}>
      <div className={`${styles.timeBox} ${last ? '' : styles.hasLine}`}>
        <div className={`${styles.time}`}>
          {`${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}
        </div>
      </div>
      <div className={`${styles.timelineCardWrapper}`}>
        <DayOfTimelineCard event={event} />
      </div>
    </div>
  );
};

export default TimelineItem;
