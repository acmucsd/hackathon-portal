'use client';
import Button from '@/components/Button';
import StatusTag from '@/components/StatusTag';
import { useState } from 'react';
import { PublicEvent, } from '@/lib/types/apiResponses';
import { formatTime } from '@/lib/utils';
import styles from './style.module.scss';

interface DayOfTimelineCardProps {
  event: PublicEvent;
}

const DayOfTimelineCard = ({ event }: DayOfTimelineCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.submissionHeader}>
        <div>
          <h2>{event.name}</h2>
          <h3 className={styles.location}>{event.location}</h3>
          <h3 className={styles.time}>{`${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}</h3>
        </div>
        <div className={styles.tagContainer}>
          <StatusTag status={event.type} />
        </div>
      </div>
      <dl className={`${expanded ? styles.expanded : styles.collapsed}`}>
        {expanded ? event.description : ''}
      </dl>
      <Button variant="tertiary" onClick={() => setExpanded(!expanded)}>
        {expanded ? '-' : '+'}
      </Button>
    </div>
  );
};

export default DayOfTimelineCard;
