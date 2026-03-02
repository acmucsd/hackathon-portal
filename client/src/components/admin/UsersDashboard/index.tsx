'use client';
import { useState } from 'react';
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import Search from '@/components/Search';
import { RevieweeProfile } from '@/lib/types/apiResponses';
import { ApplicationDecision, ApplicationStatus } from '@/lib/types/enums';
import { formatTitleCase } from '@/lib/utils';
import styles from './style.module.scss';
import UsersTable from '../UsersTable';

interface UsersDashboardProps {
  users: RevieweeProfile[];
  assignedUsers: RevieweeProfile[];
  superAdmin: boolean;
}

const UsersDashboard = ({ users, assignedUsers, superAdmin }: UsersDashboardProps) => {
  const [filterStatus, setFilterStatus] = useState(superAdmin ? 'All' : 'My Assignments');
  const [searchQuery, setSearchQuery] = useState('');

  const decisionMap: Record<ApplicationDecision, string> = {
    [ApplicationDecision.ACCEPT]: 'ACCEPTED',
    [ApplicationDecision.REJECT]: 'REJECTED',
    [ApplicationDecision.WAITLIST]: 'WAITLISTED',
    [ApplicationDecision.NO_DECISION]: 'NO_DECISION',
  };

  const sourceUsers = superAdmin ? users : assignedUsers;

  const filteredUsers = sourceUsers
    .filter(user => {
      if (filterStatus === 'All') return true;
      return (
        user.applicationStatus === filterStatus ||
        decisionMap[user.applicationDecision] === filterStatus
      );
    })
    .filter(user =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const assignedFilteredUsers = {
    'To Review': assignedUsers
      .filter(user => user.applicationDecision === ApplicationDecision.NO_DECISION)
      .filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    'My Acceptances': assignedUsers
      .filter(user => user.applicationDecision === ApplicationDecision.ACCEPT)
      .filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    'My Rejections': assignedUsers
      .filter(user => user.applicationDecision === ApplicationDecision.REJECT)
      .filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    'My Waitlists': assignedUsers
      .filter(user => user.applicationDecision === ApplicationDecision.WAITLIST)
      .filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      ),
  };

  const itemsPerPage = 10;

  return (
    <div className={styles.container}>
      <div className={styles.filterContainer}>
        <div className={styles.filterButtons}>
          {[
            ...(superAdmin ? ['All'] : ['My Assignments']),
            ...Object.values(ApplicationStatus),
          ].map(status => (
            <Button
              key={status}
              onClick={() => setFilterStatus(status)}
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
      {filterStatus === 'My Assignments' ? (
        <>
          {Object.entries(assignedFilteredUsers).map(([sectionTitle, usersInSection]) => (
            <div className={styles.sectionContainer} key={sectionTitle}>
              <Typography variant="label/large">
                {sectionTitle} ({usersInSection.length})
              </Typography>
              <UsersTable
                filteredUsers={usersInSection}
                itemsPerPage={itemsPerPage}
                superAdmin={superAdmin}
              />
            </div>
          ))}
        </>
      ) : (
        <>
          <Typography variant="label/large">
            {filterStatus === 'All' ? 'All' : formatTitleCase(filterStatus)} Participants (
            {filteredUsers.length})
          </Typography>
          <UsersTable
            filteredUsers={filteredUsers}
            itemsPerPage={itemsPerPage}
            superAdmin={superAdmin}
          />
        </>
      )}
    </div>
  );
};

export default UsersDashboard;
