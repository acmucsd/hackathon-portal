import Image from 'next/image';
import Card from '@/components/Card';
import styles from './style.module.scss';
import Banner from '@/../public/assets/banner.png';
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import TimelineItem from '@/components/TimelineItem';
import ApplicationCount from '../ApplicationCount';
import { PrivateProfile, ResponseModel } from '@/lib/types/apiResponses';

/** Dates should be at 12 am UTC. */
export interface Deadlines {
  application: Date;
  decisions: Date;
  acceptance: Date;
  hackathon: Date;
}

interface AdminDashboardProps {
  timeline: Deadlines;
  user: PrivateProfile;
  applications: ResponseModel[];
}

const AdminDashboard = ({ timeline, user, applications }: AdminDashboardProps) => {
  // Haven't implemented reviewing apps so placeholder for pending apps
  const pendingApplications = applications.length;
  const totalApplications = applications.length;

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
      <Card gap={1.5} className={`${styles.card} ${styles.status}`}>
        <ApplicationCount pendingApps={pendingApplications} totalApps={totalApplications} />
        <Button href="/review">Continue Reviewing</Button>
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
