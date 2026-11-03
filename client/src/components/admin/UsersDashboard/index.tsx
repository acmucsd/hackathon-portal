'use client';
import { useState } from 'react';
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import Search from '@/components/Search';
import { RevieweeProfile } from '@/lib/types/apiResponses';
import { ApplicationDecision, ApplicationStatus } from '@/lib/types/enums';
import { filterApplicantsByCriteria, formatTitleCase, sortRevieweeProfiles } from '@/lib/utils';
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
  const [sortBy, setSortBy] = useState('timeCreated');
  const [reverseSort, setReverseSort] = useState(false);

  const sourceUsers = superAdmin ? users : assignedUsers;

  const sortUsers = (usersToSort: RevieweeProfile[]) =>
    [...usersToSort].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'school') {
        comparison = (a.university ?? '').localeCompare(b.university ?? '', undefined, {
          sensitivity: 'base',
        });
      }
      else if (sortBy === 'decisionMade') {
        const aHasDecision = a.applicationDecision !== ApplicationDecision.NO_DECISION;
        const bHasDecision = b.applicationDecision !== ApplicationDecision.NO_DECISION;
        comparison = Number(bHasDecision) - Number(aHasDecision);
      }

      if (comparison === 0) comparison = sortRevieweeProfiles(a, b);
      return reverseSort ? -comparison : comparison;
    });

  const filteredUsers = sortUsers(
    filterApplicantsByCriteria(sourceUsers, filterStatus, searchQuery)
  );

  const assignedSections: [string, RevieweeProfile[]][] = [
    [
      'To Review',
      assignedUsers
        .filter(user => user.applicationDecision === ApplicationDecision.NO_DECISION)
        .filter(user =>
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    ],
    [
      'My Acceptances',
      assignedUsers
        .filter(user => user.applicationDecision === ApplicationDecision.ACCEPT)
        .filter(user =>
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    ],
    [
      'My Rejections',
      assignedUsers
        .filter(user => user.applicationDecision === ApplicationDecision.REJECT)
        .filter(user =>
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    ],
    [
      'My Waitlists',
      assignedUsers
        .filter(user => user.applicationDecision === ApplicationDecision.WAITLIST)
        .filter(user =>
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    ],
  ];
  const assignedFilteredUsers: [string, RevieweeProfile[]][] = assignedSections.map(
    ([sectionTitle, sectionUsers]): [string, RevieweeProfile[]] => [
      sectionTitle,
      sortUsers(sectionUsers),
    ]
  );

  if (sortBy === 'decisionMade') {
    assignedFilteredUsers.sort(([aTitle], [bTitle]) =>
      aTitle === 'To Review' ? 1 : bTitle === 'To Review' ? -1 : 0
    );
  }

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
      <div className={styles.sortControls}>
        <label htmlFor="user-sort">Sort by</label>
        <select
          id="user-sort"
          value={sortBy}
          onChange={event => setSortBy(event.currentTarget.value)}
        >
          <option value="timeCreated">Time Created</option>
          <option value="school">School</option>
          <option value="decisionMade">Decision Made</option>
        </select>
        <button
          type="button"
          className={styles.sortDirection}
          onClick={() => setReverseSort(!reverseSort)}
        >
          {reverseSort ? '↑' : '↓'}
        </button>
      </div>
      {filterStatus === 'My Assignments' ? (
        <>
          {assignedFilteredUsers.map(([sectionTitle, usersInSection]) => (
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
            filterCriteria={superAdmin ? { status: filterStatus, q: searchQuery } : undefined}
          />
        </>
      )}
    </div>
  );
};

export default UsersDashboard;
