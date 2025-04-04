import Table from '../Table';
import TableHeader from '../TableHeader';
import TableCell from '../TableCell';
import EventRow from '../EventRow';
import { PublicEvent } from '@/lib/types/apiResponses';

interface EventTableProps {
  headers: string[];
  events: PublicEvent[];
  editable?: boolean;
}

const EventTable = ({ headers, events, editable = false }: EventTableProps) => {
  return (
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
        {events.map(event => (
          <EventRow key={event.uuid} event={event} editable={editable} />
        ))}
      </tbody>
    </Table>
  );
};

export default EventTable;
