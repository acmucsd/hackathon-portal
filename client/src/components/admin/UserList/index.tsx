'use client';
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import UserItem from '../UserItem';
import { PrivateProfile } from '@/lib/types/apiResponses';
import { ApplicationStatus } from '@/lib/types/enums';
import { useState } from 'react';
import styles from './style.module.scss';

interface UserListProps {
  users: PrivateProfile[];
}

const UserList = ({ users }: UserListProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredUsers =
    filterStatus === 'All' ? users : users.filter(user => user.applicationStatus === filterStatus);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
  };

  const handleNext = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages - 1));
  };

  const startIndex = currentPage * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className={styles.container}>
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
            {status
              .replace('_', ' ')
              .toLowerCase()
              .replace(/\b\w/g, c => c.toUpperCase())}
          </Button>
        ))}
      </div>
      <hr className={styles.divider}></hr>
      <Typography variant="label/large">All Participants ({users.length})</Typography>
      <div className={styles.tableContainer}>
        {currentUsers.map(user => (
          <UserItem key={user.id} user={user}/>
        ))}
      </div>
      <div className={styles.pagination}>
        <Typography variant="label/small">
          {startIndex + 1}-{startIndex + itemsPerPage} of {filteredUsers.length}
        </Typography>
        <Button className={styles.pageButton} onClick={handlePrevious}>
          {'<'}
        </Button>
        <Button className={styles.pageButton} onClick={handleNext}>
          {'>'}
        </Button>
      </div>
    </div>
  );
};

export default UserList;
