import UserItem from '../admin/UserItem';
import UserRow from '../admin/UserRow';
import TableHeader from '../TableHeader';
import TableList from '../TableList';
import Table from '../Table';
import TableCell from '../TableCell';
import { PrivateProfile } from '@/lib/types/apiResponses';
import { useWindowSize } from '@/lib/hooks/useWindowSize';

interface UserTableProps {
  users: PrivateProfile[];
}

function UserTable({ users }: UserTableProps) {
  const headers = ['Applicant Name', 'Status', 'Creation Date', 'Action'];
  const size = useWindowSize();
  const isSmall = (size.width ?? 0) <= 1024;

  return isSmall ? (
    <TableList>
      {users.map(user => (
        <UserItem key={user.id} user={user} />
      ))}
    </TableList>
  ) : (
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
        {users.map(user => (
          <UserRow key={user.id} user={user} />
        ))}
      </tbody>
    </Table>
  );
}

export default UserTable;
