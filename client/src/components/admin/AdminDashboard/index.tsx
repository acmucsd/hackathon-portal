import Image from 'next/image';
import Card from '@/components/Card';
import styles from './style.module.scss';
import Banner from '@/../public/assets/banner.png';
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import TimelineItem from '@/components/TimelineItem';
import ApplicationCount from '../ApplicationCount';
import { PrivateProfile, FullProfile } from '@/lib/types/apiResponses';
import { ApplicationDecision, ApplicationStatus } from '@/lib/types/enums';
import { Deadlines } from '@/components/Dashboard';
import Heading from '@/components/Heading';
import QrCode from '@/components/QrCode';

interface AdminDashboardProps {
  timeline: Deadlines;
  user: PrivateProfile;
  applications: FullProfile[];
}

const AdminDashboard = ({ timeline, user, applications }: AdminDashboardProps) => {
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
      <Card gap={1.5} className={`${styles.card} ${styles.actions}`}>
        <Heading>Admin Actions</Heading>
        <Button href="/manageUsers">Manage Users</Button>
        <Button href="/manageEvents">Manage Events</Button>
        <Button href="/createEvent">Create Events</Button>
        <Button href="/admin/scan">QR Code Check-In</Button>
      </Card>
      <Card gap={1.5} className={`${styles.card} ${styles.checkin}`}>
        <Heading>QR Code Check-In</Heading>
        <p>Tap below to scan participants’ uniquely generated QR Codes. </p>
        <Button href="/admin/scan">Scan QR Codes</Button>
      </Card>
    </div>
  );
};

export default AdminDashboard;
