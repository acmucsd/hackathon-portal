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
      <Card gap={1.5} className={`${styles.card} ${styles.banner}`}>
        <Typography variant="headline/heavy/large" component="h1" className={styles.title}>
          Welcome, {user.firstName + ' ' + user.lastName}!
        </Typography>
        <Typography variant="body/medium" component="p" className={styles.subtitle}>
          Review applications and send application status updates below.
        </Typography>
        <Image
          src={Banner}
          alt="Two diamond critters find a large jewel in a vault"
          quality={100}
          className={styles.bannerImage}
        />
      </Card>
      <Card gap={1.5} className={`${styles.card}`}>
        <Heading>QR Code Check-In</Heading>
        <Button href="/admin/scan">Scan QR Codes</Button>
      </Card>
      <Card gap={1.5} className={`${styles.card} ${styles.status}`}>
        <ApplicationCount pendingApps={pendingApplications} totalApps={totalApplications} />
        <Button href="/manageUsers">Continue Reviewing</Button>
      </Card>
      <Card gap={1.5} className={`${styles.card} ${styles.timeline}`}>
        <Typography variant="headline/heavy/small" component="h2">
          Timeline
        </Typography>
        <div className={styles.timelineItemWrapper}>
          <TimelineItem date={timeline.application} first>
            Application Deadline
          </TimelineItem>
          <TimelineItem date={timeline.decisions}>Decisions Released</TimelineItem>
          <TimelineItem date={timeline.acceptance}>Acceptance Deadline</TimelineItem>
          <TimelineItem date={timeline.hackathon}>Hackathon Day!</TimelineItem>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
