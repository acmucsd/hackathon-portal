'use client';

import Image from 'next/image';
import Card from '../Card';
import styles from './style.module.scss';
import Banner from '@/../public/assets/banner.png';
import Typography from '../Typography';
import Link from 'next/link';
import FAQ, { Question } from '../FAQAccordion';
import DashboardStatus from '../DashboardStatus';
import TimelineItem from '../TimelineItem';
import { UserAPI } from '@/lib/api';
import { CookieService } from '@/lib/services';
import { useEffect, useState } from 'react';
import { CookieType } from '@/lib/types/enums';
import { useRouter } from 'next/navigation';

type Status = 'not-started' | 'incomplete' | 'submitted' | 'accepted' | 'confirmed';

/** Dates should be at 12 am UTC. */
export interface Deadlines {
  application: Date;
  decisions: Date;
  acceptance: Date;
  hackathon: Date;
}

interface DashboardProps {
  faq: Question[];
  timeline: Deadlines;
}

const Dashboard = ({ faq, timeline }: DashboardProps) => {

  const router = useRouter();

  const [name, setName] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('not-started');

  const fetchUser = async () => {
    try {
      const fetchedUser = await UserAPI.getCurrentUser();
      setName(fetchedUser.firstName + ' ' + fetchedUser.lastName);
      console.log("applicationStatus: ", fetchedUser.applicationStatus);
      // setStatus(fetchedUser.applicationStatus);
    } catch (error) {
      reportError(error);
      router.push('/login');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);


  return (
    <div className={styles.container}>
      <Card gap={1.5} className={`${styles.card} ${styles.banner}`}>
        <Typography variant="headline/heavy/large" component="h1" className={styles.title}>
          Welcome, {name}!
        </Typography>
        <Typography variant="body/medium" component="p" className={styles.subtitle}>
          Access the application and view DiamondHacks updates here.
        </Typography>
        <Image
          src={Banner}
          alt="Two diamond critters find a large jewel in a vault"
          quality={100}
          className={styles.bannerImage}
        />
      </Card>
      <Card gap={1.5} className={`${styles.card} ${styles.status}`}>
        <Typography variant="headline/heavy/small" component="h2">
          Application Status
        </Typography>
        <DashboardStatus status={status} timeline={timeline} />
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
      <Card gap={1.5} className={`${styles.card} ${styles.faq}`}>
        <Typography variant="headline/heavy/small" component="h2">
          Frequently Asked Questions
        </Typography>
        <div>
          <FAQ data={faq} />
        </div>
        <Typography variant="body/large" component="p">
          Still have questions? Email{' '}
          <Link href="mailto:hackathon@acmucsd.org" className="link">
            hackathon@acmucsd.org
          </Link>{' '}
          to reach DiamondHack’s organizers!
        </Typography>
      </Card>
    </div>
  );
};

export default Dashboard;
