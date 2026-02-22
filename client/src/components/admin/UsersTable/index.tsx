'use client';
import { useState } from 'react';
import Table from '@/components/Table';
import TableHeader from '@/components/TableHeader';
import TableCell from '@/components/TableCell';
import TableList from '@/components/TableList';
import UserRow from '../UserRow';
import UserItem from '../UserItem';
import Pagination from '@/components/Pagination';
import { FullProfile } from '@/lib/types/apiResponses';
import { useWindowSize } from '@/lib/hooks/useWindowSize';

interface UsersTableProps {
  filteredUsers: FullProfile[];
  itemsPerPage?: number;
}

const UsersTable = ({ filteredUsers, itemsPerPage = 10 }: UsersTableProps) => {
  const [currentPage, setCurrentPage] = useState(0);

  const headers = ['Applicant Name', 'Status', 'School', 'Interest Form?', 'Submission', 'Action'];
  const size = useWindowSize();
  const isSmall = (size.width ?? 0) <= 1024;

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
  const handleNext = () => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages - 1));

  return (
    <>
      {isSmall ? (
        <TableList>
          {currentUsers.map(user => (
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
            {currentUsers.map(user => (
              <UserRow key={user.id} user={user} />
            ))}
          </tbody>
        </Table>
      )}
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredUsers.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </>
  );
};

export default UsersTable;
