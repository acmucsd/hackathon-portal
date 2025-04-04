import Card from '@/components/Card';
import Typography from '@/components/Typography';
import StatusTag from '@/components/StatusTag';
import { PublicEvent } from '@/lib/types/apiResponses';
import styles from './style.module.scss';

interface EventItemProps {
  event: PublicEvent;
}

const EventItem = ({ event }: EventItemProps) => {
  return (
    <Card gap={1} className={styles.container}>
      <StatusTag status={event.type} />
      <Typography variant="title/small">{event.name}</Typography>
      <Typography variant="body/medium">@ {event.location}</Typography>
      <Typography variant="body/medium">
        {event.startTime} - {event.endTime}
      </Typography>
    </Card>
  );
};

export default EventItem;
