import { useState } from 'react';
import Card from '../Card';
import Typography from '../Typography';
import { PublicEvent } from '@/lib/types/apiResponses';
import styles from './style.module.scss';
import Button from '../Button';

interface DashboardOccurringNowProps {
  event: PublicEvent;
}

const DashboardOccurringNow = ({ event }: DashboardOccurringNowProps) => {
  return (
    <>
      <Typography variant="headline/heavy/small" component="h2">
        {event.name}
      </Typography>
      <div className={`${styles.badges}`}>
        <div className={`${styles.badge} ${styles['LIVE']}`}>Live</div>
        <div className={`${styles.badge} ${styles['INFO']}`}>{event.name}</div>
        <div className={`${styles.badge} ${styles['INFO']}`}>{event.location}</div>
      </div>
      <Typography variant="body/medium" component="p">
        {event.description}
      </Typography>
      <Button href="/schedule">View schedule</Button>
    </>
  );
};

export default DashboardOccurringNow;
