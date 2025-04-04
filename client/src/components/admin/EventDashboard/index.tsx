'use client';
import Heading from '@/components/Heading';
import Button from '@/components/Button';
import Table from '@/components/Table';
import Typography from '@/components/Typography';
import TableHeader from '@/components/TableHeader';
import TableCell from '@/components/TableCell';
import EventItem from '@/components/EventItem';
import EventRow from '@/components/EventRow';
import EditIcon from '../../../../public/assets/icons/edit.svg';
import { Day } from '@/lib/types/enums';
import { PublicEvent } from '@/lib/types/apiResponses';
import { formatTitleCase } from '@/lib/utils';
import { useState } from 'react';
import styles from './style.module.scss';

interface EventDashboardProps {
  events: PublicEvent[];
}

const EventDashboard = ({ events }: EventDashboardProps) => {
  const [filterDay, setFilterDay] = useState(Day.SATURDAY);
  const headers = ['Time', 'Event', 'Type', 'Location'];

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
            <EditIcon />
          </div>
          <Table>
            <thead>
              <TableHeader>
                {headers.map(header => (
                  <TableCell key={header} type="th">
                    {header}
                  </TableCell>
                ))}
              </TableHeader>
            </thead>
            <tbody>
              {publishedEvents.map(event => (
                <EventRow key={event.uuid} event={event} />
              ))}
            </tbody>
          </Table>
        </div>
        <div className={styles.events}>
          <div className={styles.titleHeader}>
            <Typography variant="title/medium">Unpublished</Typography>
            <EditIcon />
          </div>
          <Table>
            <thead>
              <TableHeader>
                {headers.map(header => (
                  <TableCell key={header} type="th">
                    {header}
                  </TableCell>
                ))}
              </TableHeader>
            </thead>
            <tbody>
              {unpublishedEvents.map(event => (
                <EventRow key={event.uuid} event={event} />
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default EventDashboard;
