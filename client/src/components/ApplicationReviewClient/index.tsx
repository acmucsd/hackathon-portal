'use client';

import { useMemo, useState } from 'react';
import styles from './style.module.scss';

import ApplicationView from '@/components/admin/ApplicationView';
import ApplicationReviewPanel from '@/components/ApplicationReviewPanel';
import { ApplicationDecision, ApplicationStatus } from '@/lib/types/enums';
import type { Application } from '@/lib/types/application';
import type { PublicProfile, ResponseModel } from '@/lib/types/apiResponses';

type Props = {
  accessToken: string;
  fetchedApplications: ResponseModel[];
  fetchedWaiversByUserId: Record<string, ResponseModel[]>;
  reviewer?: PublicProfile;
};

// TEMP dummy (keep for now)
const dummyReviewer = {
  id: 'reviewer-1',
  firstName: 'Avery',
  lastName: 'Reviewer',
} as PublicProfile;
const dummyApplicants = [
  { firstName: 'Mina', lastName: 'Patel' } as any,
  { firstName: 'Jordan', lastName: 'Kim' } as any,
] as Application[];

export default function ApplicationReviewClient({
  accessToken,
  fetchedApplication,
  fetchedDecision,
  fetchedWaivers,
}: Props) {
  const applicants = useMemo(() => dummyApplicants, []);
  const reviewer = useMemo(() => dummyReviewer, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // single source of truth for what ApplicationView displays
  const [currentDecision, setCurrentDecision] = useState<ApplicationDecision>(fetchedDecision);
  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>(
    fetchedApplication.user.applicationStatus
  );
  const [notes, setNotes] = useState<string>('');

  // keep these for later when you expand to multiple applicants
  const [decisions, setDecisions] = useState<Record<number, ApplicationDecision>>({});
  const [notesByIndex, setNotesByIndex] = useState<Record<number, string>>({});

  const onPrev = () => setCurrentIndex(i => Math.max(0, i - 1));
  const onNext = () => setCurrentIndex(i => Math.min(applicants.length - 1, i + 1));

  // might be useful later?
  // const handleDecision = async (decision: ApplicationDecision) => {
  //   if (currentStatus === ApplicationStatus.CONFIRMED) {
  //     showToast(
  //       "Couldn't update application decision",
  //       'User has already been confirmed for the hackathon.'
  //     );
  //     return;
  //   }
  //   try {
  //     const updatedUser = await AdminAPI.updateApplicationDecision(token, user.id, decision);
  //     const updatedDecision = updatedUser.applicationDecision;
  //     // setCurrentDecision(updatedDecision);
  //     showToast(`${updatedDecision}ED`, `You marked the application as "${updatedDecision}ED".`);
  //   } catch (error) {
  //     reportError("Couldn't update application decision", error);
  //   }
  // };

  // const handleConfirmUser = async () => {
  //   if (currentDecision !== ApplicationDecision.ACCEPT) {
  //     showToast("Couldn't confirm user", "User hasn't been accepted to the hackathon.");
  //     return;
  //   }
  //   try {
  //     if (onConfirm) {
  //       await onConfirm();
  //       return;
  //     }
  //     const updatedUser = await AdminAPI.confirmUserStatus(token, user.id);
  //     // setCurrentStatus(updatedUser.applicationStatus);
  //     showToast('CONFIRMED', 'Successfully marked the user as CONFIRMED');
  //   } catch (error) {
  //     reportError("Couldn't confirm user", error);
  //   }
  // };

  const onReset = () => {
    // sync reset
    setCurrentDecision(ApplicationDecision.NO_DECISION);
    setNotes('');

    // keep these for later when you expand to multiple applicants
    setDecisions(prev => ({ ...prev, [currentIndex]: ApplicationDecision.NO_DECISION }));
    setNotesByIndex(prev => ({ ...prev, [currentIndex]: '' }));
  };

  const onSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(r => setTimeout(r, 300));
      // TODO: add API calls

      // keep these for later when you expand to multiple applicants
      setDecisions(prev => ({ ...prev, [currentIndex]: currentDecision }));
      setNotesByIndex(prev => ({ ...prev, [currentIndex]: notes }));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.appView}>
        <ApplicationView
          application={fetchedApplication}
          token={accessToken}
          decision={currentDecision}
          status={currentStatus}
          waivers={fetchedWaivers}
        />
      </div>

      <div className={styles.appReviewPanel}>
        <ApplicationReviewPanel
          applicant={applicants[currentIndex]}
          reviewer={reviewer}
          currentIndex={currentIndex}
          totalApplicants={applicants.length}
          decision={currentDecision}
          onDecisionChange={setCurrentDecision}
          notes={notes}
          onNotesChange={setNotes}
          onPrev={onPrev}
          onNext={onNext}
          onReset={onReset}
          onSave={onSave}
          isSaving={isSaving}
        />
      </div>
    </main>
  );
}
