'use client';
import styles from './style.module.scss';
import Button from '@/components/Button';
import { PrivateProfile, RevieweeProfile, ReviewAssignment } from '@/lib/types/apiResponses';
import { Deadlines } from '@/components/Dashboard';
import { useState } from 'react';
import UsersDashboard from '@/components/admin/UsersDashboard';
import SuperAdminTools from '@/components/admin/SuperAdminTools';
import ReviewersTable from '@/components/admin/ReviewersTable';

interface AdminDashboardProps {
  timeline: Deadlines;
  user: PrivateProfile;
  applications: RevieweeProfile[];
  assignments: ReviewAssignment[];
  token: string;
}

const SuperAdminDashboard = ({
  timeline,
  user,
  applications,
  assignments,
  token,
}: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('applications');

  return (
    <div className={styles.container}>
      <h1>Welcome, {user.firstName}!</h1>
      <div className={styles.buttons}>
        <Button
          onClick={() => setActiveTab('applications')}
          className={activeTab === 'applications' ? styles.activeButton : styles.nonActiveButton}
        >
          All Applications
        </Button>
        <Button
          onClick={() => setActiveTab('reviewers')}
          className={activeTab === 'reviewers' ? styles.activeButton : styles.nonActiveButton}
        >
          Reviewers List
        </Button>
        <Button
          onClick={() => setActiveTab('tools')}
          className={activeTab === 'tools' ? styles.activeButton : styles.nonActiveButton}
        >
          Super Admin Tools
        </Button>
      </div>
      {activeTab === 'applications' && (
        <UsersDashboard users={applications} assignedUsers={applications} superAdmin={true} />
      )}
      {activeTab === 'reviewers' && <ReviewersTable assignments={assignments} />}
      {activeTab === 'tools' && <SuperAdminTools token={token} user={user} />}
    </div>
  );
};

export default SuperAdminDashboard;
