'use client';
import Heading from '@/components/Heading';
import Button from '@/components/Button';
import Typography from '@/components/Typography';
import EventTable from '@/components/EventTable';
import { Day } from '@/lib/types/enums';
import { useWindowSize } from '@/lib/hooks/useWindowSize';
import { PublicEvent } from '@/lib/types/apiResponses';
import { formatTitleCase } from '@/lib/utils';
import { useState } from 'react';
import styles from './style.module.scss';
import EventList from '@/components/EventList';

interface ScheduleProps {
  events: PublicEvent[];
}

const Schedule = ({ events }: ScheduleProps) => {
  const [filterDay, setFilterDay] = useState(Day.SATURDAY);

  const headers = ['Time', 'Event', 'Type', 'Hosts', 'Location'];

  const size = useWindowSize();
  const isSmall = (size.width ?? 0) <= 1024;

  const filterAndSortEvents = (events: PublicEvent[], day: Day) => {
    return events
      .filter(event => event.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const publishedEvents = filterAndSortEvents(events, filterDay);

  return (
    <div className={styles.container}>
      <Heading>Schedule</Heading>
      <div className={styles.filterButtons}>
        {Object.values(Day).map(day => (
          <Button
            key={day}
            onClick={() => {
              setFilterDay(day);
            }}
            className={filterDay === day ? styles.activeFilter : ''}
            variant="tertiary"
          >
            {formatTitleCase(day)}
          </Button>
        ))}
      </div>
      <hr className={styles.divider} />
      <div className={styles.eventContainer}>
        <div className={styles.events}>
          {isSmall ? (
            <EventList events={publishedEvents} />
          ) : (
            <EventTable headers={headers} events={publishedEvents} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
