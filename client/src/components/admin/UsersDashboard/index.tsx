'use client';
import { useState } from 'react';
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import Search from '@/components/Search';
import Table from '@/components/Table';
import TableHeader from '@/components/TableHeader';
import TableCell from '@/components/TableCell';
import TableList from '@/components/TableList';
import UserRow from '../UserRow';
import UserItem from '../UserItem';
import Pagination from '@/components/Pagination';
import { FullProfile } from '@/lib/types/apiResponses';
import { ApplicationStatus } from '@/lib/types/enums';
import { useWindowSize } from '@/lib/hooks/useWindowSize';
import { formatTitleCase } from '@/lib/utils';
import styles from './style.module.scss';

interface UsersDashboardProps {
  users: FullProfile[];
  superAdmin: boolean;
}

const UsersDashboard = ({ users, superAdmin }: UsersDashboardProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [filterStatus, setFilterStatus] = useState('CONFIRMED');
  const [searchQuery, setSearchQuery] = useState('');

  const headers = ['Applicant Name', 'Status', 'Creation Date', ...(superAdmin ? ['Assigned Reviewer'] : []), 'Action', ];
  const size = useWindowSize();
  const isSmall = (size.width ?? 0) <= 1024;

  const filteredUsers = users
    .filter(user => {
      if (filterStatus === 'All') return true;
      return user.applicationStatus === filterStatus;
    })
    .filter(user =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
  const handleNext = () => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages - 1));

  return (
    <div className={styles.container}>
      <div className={styles.filterContainer}>
        <div className={styles.filterButtons}>
          {['All', ...Object.values(ApplicationStatus)].map(status => (
            <Button
              key={status}
              onClick={() => {
                setFilterStatus(status);
                setCurrentPage(0);
              }}
              className={filterStatus === status ? styles.activeFilter : ''}
              variant="tertiary"
            >
              {formatTitleCase(status)}
            </Button>
          ))}
        </div>
        <Search query={searchQuery} setQuery={setSearchQuery} />
      </div>
      <hr className={styles.divider} />
      <Typography variant="label/large">
        {formatTitleCase(filterStatus)} Participants ({filteredUsers.length})
      </Typography>
      {isSmall ? (
        <TableList>
          {currentUsers.map(user => (
            <UserItem key={user.id} user={user} superAdmin={superAdmin} />
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
              <UserRow key={user.id} user={user} superAdmin={superAdmin}/>
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
    </div>
  );
};

export default UsersDashboard;
