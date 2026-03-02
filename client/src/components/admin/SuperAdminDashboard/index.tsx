'use client';
import Image from 'next/image';
import Card from '@/components/Card';
import styles from './style.module.scss';
import Banner from '@/../public/assets/banner.png';
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import TimelineItem from '@/components/TimelineItem';
import ApplicationCount from '../ApplicationCount';
import { PrivateProfile, FullProfile, ReviewAssignment } from '@/lib/types/apiResponses';
import { ApplicationDecision, ApplicationStatus } from '@/lib/types/enums';
import { Deadlines } from '@/components/Dashboard';
import Heading from '@/components/Heading';
import QrCode from '@/components/QrCode';
import AdminDashboard from '../AdminDashboard';
import { act, useState } from 'react';
import UsersDashboard from '@/components/admin/UsersDashboard';
import SuperAdminTools from '@/components/admin/SuperAdminTools';
import ReviewersTable from '@/components/admin/ReviewersTable';
interface AdminDashboardProps {
  timeline: Deadlines;
  user: PrivateProfile;
  applications: FullProfile[];
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
  const pendingApplications = applications.filter(
    user =>
      user.applicationDecision === ApplicationDecision.NO_DECISION &&
      user.applicationStatus === ApplicationStatus.SUBMITTED
  ).length;
  const totalApplications = applications.filter(
    user => user.applicationStatus !== ApplicationStatus.NOT_SUBMITTED
  ).length;

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
      {activeTab === 'applications' && <UsersDashboard users={applications} superAdmin={true} />}
      {activeTab === 'reviewers' && <ReviewersTable assignments={assignments} />}
      {activeTab === 'tools' && <SuperAdminTools token={token} user={user} />}
    </div>
  );
};

export default SuperAdminDashboard;
