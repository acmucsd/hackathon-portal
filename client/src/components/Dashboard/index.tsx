'use client';

import Image from 'next/image';
import Card from '../Card';
import styles from './style.module.scss';
import Banner from '@/../public/assets/banner.png';
import Typography from '../Typography';
import Link from 'next/link';
import FAQ, { FAQQuestion } from '../FAQAccordion';
import DashboardStatus from '../DashboardStatus';
import TimelineItem from '../TimelineItem';
import { PrivateProfile, PublicEvent } from '@/lib/types/apiResponses';
import QrCode from '../QrCode';
import Button from '../Button';
import { ApplicationStatus, Day } from '@/lib/types/enums';
import Modal from '../Modal';
import { useState } from 'react';

type Status = 'NOT_SUBMITTED' | 'SUBMITTED' | 'WITHDRAWN' | 'ACCEPTED' | 'REJECTED' | 'CONFIRMED';

/** Dates are in local time (America/Los_Angeles) */
export interface Deadlines {
  application: Date;
  decisions: Date;
  acceptance: Date;
  hackathon: Date;
}

interface DashboardProps {
  faq: FAQQuestion[];
  timeline: Deadlines;
  user: PrivateProfile;
}

const Dashboard = ({ faq, timeline, user }: DashboardProps) => {
  const [showBigQr, setShowBigQr] = useState(false);

  return (
    <div className={styles.container}>
      <Card gap={1.5} className={`${styles.card} ${styles.banner}`}>
        <Typography variant="headline/heavy/large" component="h1" className={styles.title}>
          Welcome, {user.firstName + ' ' + user.lastName}!
        </Typography>
        <Typography variant="body/medium" component="p" className={styles.subtitle}>
          View DiamondHacks updates, resources, and check-in to events here.
        </Typography>
        <Image
          src={Banner}
          alt="Two diamond critters find a large jewel in a vault"
          quality={100}
          className={styles.bannerImage}
        />
      </Card>
      {user.applicationStatus === ApplicationStatus.CONFIRMED ? (
        <Card gap={1.5} className={`${styles.card} ${styles.status}`}>
          <Typography variant="headline/heavy/small" component="h2">
            QR Code Check-In
          </Typography>
          <QrCode data={user.id} />
          <Typography variant="body/medium" component="p">
            Use this QR Code to check into ACM-affiliated hackathon events, grab free food, and
            more!
          </Typography>
          <Button onClick={() => setShowBigQr(true)}>Enlarge QR Code</Button>
        </Card>
      ) : (
        <Card gap={1.5} className={`${styles.card} ${styles.status}`}>
          <Typography variant="headline/heavy/small" component="h2">
            Application Status
          </Typography>
          <DashboardStatus status={user.applicationStatus as Status} timeline={timeline} />
        </Card>
      )}
      {user.applicationStatus === ApplicationStatus.CONFIRMED ? (
        <Card gap={1.5} className={`${styles.card} ${styles.timeline}`}>
          <Typography variant="headline/heavy/small" component="h2">
            Onboarding Checklist
          </Typography>
          <ul className={styles.onboardingChecklist}>
            <li>
              <Typography variant="body/large">
                Fill out the{' '}
                <Link href="/photoRelease" className={styles.link}>
                  photo release waiver
                </Link>
              </Typography>
            </li>
            <li>
              <Typography variant="body/large">
                Fill out the{' '}
                <Link href="/liability" className={styles.link}>
                  liability waiver
                </Link>
              </Typography>
            </li>
            <li>
              <Typography variant="body/large">
                Join the{' '}
                <Link
                  href="http://acmurl.com/diamondhacks25-discord"
                  className={styles.link}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  ACM DiamondHacks Discord
                </Link>{' '}
                for real-time, up-to-date announcements
              </Typography>
            </li>
            <li>
              <Typography variant="body/large">
                Check out the{' '}
                <Link
                  href="http://acmurl.com/diamondhacks25-guide"
                  className={styles.link}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  ACM DiamondHacks Hacker Guide
                </Link>
              </Typography>
            </li>
            <li>
              <Typography variant="body/large">
                Check out the{' '}
                <Link href="/schedule" className={styles.link}>
                  schedule
                </Link>{' '}
                of events and workshops
              </Typography>
            </li>
          </ul>
        </Card>
      ) : (
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
      )}
      {user.applicationStatus === ApplicationStatus.CONFIRMED ? null : (
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
            to reach DiamondHacks’s organizers!
          </Typography>
        </Card>
      )}
      <Modal
        title={`${user.firstName} ${user.lastName}'s QR Code`}
        open={showBigQr}
        onClose={() => setShowBigQr(false)}
      >
        <QrCode data={user.id} square className={styles.bigQr} />
      </Modal>
    </div>
  );
};

export default Dashboard;
