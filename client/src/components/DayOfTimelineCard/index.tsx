'use client';
import Button from '@/components/Button';
import Typography from '../Typography';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import StatusTag from '@/components/StatusTag';
import { useState } from 'react';
import { PublicEvent } from '@/lib/types/apiResponses';
import { formatTime } from '@/lib/utils';
import styles from './style.module.scss';

interface DayOfTimelineCardProps {
  event: PublicEvent;
}

const DayOfTimelineCard = ({ event }: DayOfTimelineCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={styles.container}
      onClick={() => {
        setExpanded(!expanded);
      }}
    >
      <div className={styles.submissionHeader}>
        <div className={styles.headerText}>
          <Typography variant="title/medium" component="h2">
            {event.name}
          </Typography>
          <div className={styles.locationContainer}>
            <LocationOnOutlinedIcon />
            <Typography variant="body/medium" className={styles.location}>
              {event.location}
            </Typography>
          </div>
          <Typography variant="body/medium" className={styles.time}>
            {`${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}
          </Typography>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.tagContainer}>
            <StatusTag status={event.type} />
          </div>
          <div className={styles.points}>
            <span className={styles.plus}>+</span>
            <span>{event.pointValue} pts</span>
          </div>
        </div>
      </div>
      <dl className={`${expanded ? styles.expanded : styles.collapsed}`}>
        {expanded ? event.description : ''}
      </dl>
      <div className={styles.plusminus}>{expanded ? '-' : '+'}</div>
    </div>
  );
};

export default DayOfTimelineCard;
