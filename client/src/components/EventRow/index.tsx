'use client';
import TableRow from '@/components/TableRow';
import TableCell from '@/components/TableCell';
import Button from '@/components/Button';
import Typography from '@/components/Typography';
import StatusTag from '@/components/StatusTag';
import { PublicEvent } from '@/lib/types/apiResponses';
import EditIcon from '../../../public/assets/icons/edit.svg';
import UpArrow from '../../../public/assets/icons/up-arrow.svg';
import { formatTime } from '@/lib/utils';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './style.module.scss';

interface EventRowProps {
  event: PublicEvent;
  editable?: boolean;
}

const EventRow = ({ event, editable = false }: EventRowProps) => {
  const startTimeFormatted = formatTime(event.startTime);
  const endTimeFormatted = formatTime(event.endTime);
  const formattedDate = `${startTimeFormatted} - ${endTimeFormatted}`;

  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/modifyEvent/${event.uuid}`);
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <UpArrow
            className={`${styles.accordion} ${showDetails ? styles.rotate : ''}`}
            onClick={() => setShowDetails(prev => !prev)}
          />
          {formattedDate}
        </TableCell>
        <TableCell>{event.name}</TableCell>
        <TableCell>
          <StatusTag status={event.type} />
        </TableCell>
        <TableCell>
          {event.locationLink ? (
            <Button
              variant="tertiary"
              className={styles.locationButton}
              href={event.locationLink}
              openNewTab
            >
              {event.location} ↗
            </Button>
          ) : (
            event.location
          )}
        </TableCell>
      </TableRow>

      {showDetails && (
        <TableRow className={styles.popupRow}>
          <TableCell className={styles.popupCell} colSpan={4}>
            <div className={styles.popupContent}>
              <div className={styles.popupHeader}>
                <div className={styles.popupTitle}>
                  <Typography variant="title/small">{event.name}</Typography>
                  <StatusTag status={event.type} />
                </div>
                {editable && <EditIcon className={styles.editIcon} onClick={handleEdit} />}
              </div>
              <Typography variant="body/medium">hosted by {event.host}</Typography>
              <Typography variant="body/medium">
                {formattedDate} | {event.location}
              </Typography>
              <Typography variant="body/medium">{event.description}</Typography>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default EventRow;
