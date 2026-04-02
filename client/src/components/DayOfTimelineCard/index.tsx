'use client';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Heading from '@/components/Heading';
import StatusTag from '@/components/StatusTag';
import { appQuestions } from '@/config';
import { Fragment, useState } from 'react';
import { PublicEvent, ResponseModel } from '@/lib/types/apiResponses';
import { ApplicationStatus, EventType } from '@/lib/types/enums';
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
        </div>
        <div className={styles.tagContainer}>
          <StatusTag status={event.type} />
        </div>
      </div>
      <dl className={`${expanded ? styles.expanded : styles.collapsed}`}>
        {expanded ? event.description : ''}
      </dl>
      <Button variant="tertiary" onClick={() => setExpanded(!expanded)}>
        {expanded ? 'See Less' : 'See More'}
      </Button>
    </div>
  );
};

export default DayOfTimelineCard;
