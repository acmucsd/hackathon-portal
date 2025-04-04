import Card from '@/components/Card';
import Typography from '@/components/Typography';
import StatusTag from '@/components/StatusTag';
import { PublicEvent } from '@/lib/types/apiResponses';
import { formatTime } from '@/lib/utils';
import styles from './style.module.scss';

interface EventItemProps {
  event: PublicEvent;
  onClick: () => void;
}

const EventItem = ({ event, onClick }: EventItemProps) => {
  return (
    <div onClick={onClick}>
      <Card gap={1} className={styles.container}>
        <StatusTag status={event.type} />
        <Typography variant="title/small">{event.name}</Typography>
        <Typography variant="body/medium">@ {event.location}</Typography>
        <Typography variant="body/medium">
          {formatTime(event.startTime)} - {formatTime(event.endTime)}
        </Typography>
      </Card>
    </div>
  );
};

export default EventItem;
