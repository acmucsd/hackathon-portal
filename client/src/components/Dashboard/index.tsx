'use client';

import Image from 'next/image';
import Card from '../Card';
import styles from './style.module.scss';
import TopBanner from '@/../public/assets/banner2.png';
import BottomBanner from '@/../public/assets/bottombanner.png';
import SunGod from '@/../public/assets/sungod-with-book.png';
import Typography from '../Typography';
import OnboardingTaskCard from '../OnboardingTaskCard';
import { ONBOARDING_TASKS } from './onboardingTasks';
import Link from 'next/link';
import FAQ, { FAQQuestion } from '../FAQAccordion';
import DashboardStatus from '../DashboardStatus';
import TimelineItem from '../TimelineItem';
import { PrivateProfile, PublicEvent, ResponseModel } from '@/lib/types/apiResponses';
import QrCode from '../QrCode';
import Button from '../Button';
import { ApplicationStatus, Day, FormType } from '@/lib/types/enums';
import Modal from '../Modal';
import { useState } from 'react';
import { addToGoogleWallet } from './wallet';
import showToast from '@/lib/showToast';

type Status = 'NOT_SUBMITTED' | 'SUBMITTED' | 'WITHDRAWN' | 'ACCEPTED' | 'REJECTED' | 'CONFIRMED';

/** Dates are in local time (America/Los_Angeles) */
export interface Deadlines {
  application: Date;
  decisions: Date;
  acceptance: Date;
  waitlist: Date;
  hackathon: Date;
}

interface DashboardProps {
  faq: FAQQuestion[];
  timeline: Deadlines;
  user: PrivateProfile;
  responses: ResponseModel[];
}

const Dashboard = ({ faq, timeline, user, responses }: DashboardProps) => {
  const [showBigQr, setShowBigQr] = useState(false);
  const isConfirmed =
    user.applicationStatus === ApplicationStatus.CONFIRMED ||
    user.applicationStatus === ApplicationStatus.ACCEPTED;

  const completedFormTypes = new Set(responses.map(r => r.formType));
  const qrUnlocked =
    completedFormTypes.has(FormType.LIABILITY_WAIVER) &&
    completedFormTypes.has(FormType.PHOTO_RELEASE);

  return (
    <div
      className={`${styles.container} ${isConfirmed ? styles.confirmedContainer : styles.notConfirmed}`}
    >
      <Card gap={1.5} className={`${styles.card} ${styles.banner}`}>
        <Typography variant="headline/heavy/large" component="h1" className={styles.title}>
          Welcome, {user.firstName + ' ' + user.lastName}!
        </Typography>
        <Typography variant="body/medium" component="p" className={styles.subtitle}>
          Access the application and view DiamondHacks updates below.
        </Typography>
        <Image
          src={TopBanner}
          alt="Books and potions in the shelf"
          quality={100}
          className={styles.bannerImage}
        />
      </Card>

      {isConfirmed ? (
        <>
          <Card gap={1.5} className={`${styles.card} ${styles.onboarding}`}>
            <Typography variant="headline/heavy/small" component="h2">
              Onboarding Tasks
            </Typography>
            <div className={styles.onboardingTaskGrid}>
              {ONBOARDING_TASKS.map(task => (
                <OnboardingTaskCard
                  key={task.title}
                  task={task}
                  done={task.formType ? completedFormTypes.has(task.formType) : false}
                />
              ))}
            </div>
          </Card>

          <Card gap={1.5} className={`${styles.card} ${styles.status}`}>
            <Typography variant="headline/heavy/small" component="h2">
              QR Code Check-In
            </Typography>
            <div className={styles.qrWrapper}>
              <QrCode data={user.id} className={!qrUnlocked ? styles.qrBlurred : undefined} />
              {!qrUnlocked && <div className={styles.qrOverlay} />}
            </div>
            <Typography className={styles.qrText} variant="body/medium" component="p">
              {qrUnlocked
                ? 'Use this QR Code to check into ACM-affiliated hackathon events, grab free food, and more!'
                : 'Complete the required forms to unlock the QR code!'}
            </Typography>
            {qrUnlocked && (
              <>
                <Button onClick={() => setShowBigQr(true)}>Enlarge QR Code</Button>
                <Button
                  onClick={async () => {
                    const error = await addToGoogleWallet(window.location.origin);
                    if (error) {
                      showToast('Failed to create a pass', error);
                    }
                  }}
                  variant="secondary"
                >
                  Add to Google Wallet
                </Button>
              </>
            )}
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
              to reach DiamondHacks organizers!
            </Typography>
            <Image
              src={SunGod}
              alt="Sun God holding a book"
              quality={100}
              className={styles.sunGodImage}
            />
          </Card>
        </>
      ) : (
        <>
          <Card gap={1.5} className={`${styles.card} ${styles.status}`}>
            <Typography variant="headline/heavy/small" component="h2">
              Application Status
            </Typography>
            <DashboardStatus status={user.applicationStatus as Status} timeline={timeline} />
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
              <TimelineItem date={timeline.acceptance}>RSVP Deadline</TimelineItem>
              <TimelineItem date={timeline.waitlist}>Rolling Waitlist RSVP</TimelineItem>
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
              to reach DiamondHacks organizers!
            </Typography>
            <Image
              src={SunGod}
              alt="Sun God holding a book"
              quality={100}
              className={styles.sunGodImage}
            />
          </Card>
        </>
      )}

      <Image
        src={BottomBanner}
        alt="Banners of the four houses: Raccoon, Sun God, Geisel, and Triton"
        quality={100}
        className={styles.banner2}
      />

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
