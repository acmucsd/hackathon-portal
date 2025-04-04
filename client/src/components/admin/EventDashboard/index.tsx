'use client';
import Heading from '@/components/Heading';
import Button from '@/components/Button';
import Typography from '@/components/Typography';
import EventTable from '@/components/EventTable';
import EditIcon from '../../../../public/assets/icons/edit.svg';
import { Day } from '@/lib/types/enums';
import { useWindowSize } from '@/lib/hooks/useWindowSize';
import { PublicEvent } from '@/lib/types/apiResponses';
import { formatTitleCase } from '@/lib/utils';
import { useState } from 'react';
import styles from './style.module.scss';
import EventList from '@/components/EventList';

interface EventDashboardProps {
  events: PublicEvent[];
}

const EventDashboard = ({ events }: EventDashboardProps) => {
  const [filterDay, setFilterDay] = useState(Day.SATURDAY);
  const [allowEditPublished, setAllowEditPublished] = useState(false);
  const [allowEditUnpublished, setAllowEditUnpublished] = useState(false);

  const headers = ['Time', 'Event', 'Type', 'Location'];

  const size = useWindowSize();
  const isSmall = (size.width ?? 0) <= 1024;

  const filterAndSortEvents = (events: PublicEvent[], day: Day, published: boolean) => {
    return events
      .filter(event => event.day === day && event.published === published)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const publishedEvents = filterAndSortEvents(events, filterDay, true);
  const unpublishedEvents = filterAndSortEvents(events, filterDay, false);

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
          <div className={styles.titleHeader}>
            <Typography variant="title/medium">Published</Typography>
            <EditIcon
              className={styles.editIcon}
              onClick={() => setAllowEditPublished(prev => !prev)}
            />
          </div>
          {isSmall ? (
            <EventList events={publishedEvents} editable={allowEditPublished} />
          ) : (
            <EventTable headers={headers} events={publishedEvents} editable={allowEditPublished} />
          )}
        </div>
        <div className={styles.events}>
          <div className={styles.titleHeader}>
            <Typography variant="title/medium">Unpublished</Typography>
            <EditIcon
              className={styles.editIcon}
              onClick={() => setAllowEditUnpublished(prev => !prev)}
            />
          </div>
          {isSmall ? (
            <EventList events={unpublishedEvents} editable={allowEditUnpublished} />
          ) : (
            <EventTable
              headers={headers}
              events={unpublishedEvents}
              editable={allowEditUnpublished}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDashboard;
