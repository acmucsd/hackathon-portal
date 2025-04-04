import Card from '@/components/Card';
import Typography from '@/components/Typography';
import StatusTag from '@/components/StatusTag';
import CloseIcon from '../../../public/assets/icons/close.svg';
import EditIcon from '../../../public/assets/icons/edit.svg';
import { PublicEvent } from '@/lib/types/apiResponses';
import { Day } from '@/lib/types/enums';
import { formatTime } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import styles from './style.module.scss';

interface EventModalProps {
  event: PublicEvent;
  onClick: () => void;
  editable?: boolean;
}

const EventModal = ({ event, onClick, editable = false }: EventModalProps) => {
  const eventDay = event.day === Day.SATURDAY ? 'April 5th, 2025,' : 'April 6th, 2025,';
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/modifyEvent/${event.uuid}`);
  };
  return (
    <div className={styles.modal}>
      <Card gap={1} className={styles.container}>
        <div className={styles.iconContainer}>
          {editable && <EditIcon onClick={handleEdit} />}
          <CloseIcon className={styles.closeIcon} onClick={onClick} />
        </div>
        <Typography variant="title/large">{event.name}</Typography>
        <Typography variant="body/large">
          {eventDay} {formatTime(event.startTime)} - {formatTime(event.endTime)}
        </Typography>
        <Typography variant="body/large">{event.location}</Typography>
        <StatusTag status={event.type} />
        <Typography variant="body/medium">{event.description}</Typography>
        <Typography variant="body/large">
          <strong>hosted by {event.host}</strong>
        </Typography>
      </Card>
    </div>
  );
};

export default EventModal;
