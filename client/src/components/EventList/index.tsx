import { useState } from 'react';
import TableList from '../TableList';
import EventItem from '../EventItem';
import EventModal from '../EventModal';
import { PublicEvent } from '@/lib/types/apiResponses';

interface EventListProps {
  events: PublicEvent[];
  editable?: boolean;
}

const EventList = ({ events, editable = false }: EventListProps) => {
  const [selectedEvent, setSelectedEvent] = useState<PublicEvent | null>(null);

  const handleOpenModal = (event: PublicEvent) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <>
      <TableList>
        {events.map(event => (
          <EventItem key={event.uuid} event={event} onClick={() => handleOpenModal(event)} />
        ))}
      </TableList>
      {selectedEvent && (
        <EventModal event={selectedEvent} onClick={handleCloseModal} editable={editable} />
      )}
    </>
  );
};

export default EventList;
