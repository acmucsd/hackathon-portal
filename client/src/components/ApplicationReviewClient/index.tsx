'use client';

import { useMemo, useState } from 'react';
import styles from './style.module.scss';

import ApplicationView from '@/components/admin/ApplicationView';
import ApplicationReviewPanel from '@/components/ApplicationReviewPanel';
import { ApplicationDecision, ApplicationStatus } from '@/lib/types/enums';
import showToast from '@/lib/showToast';
import { AdminAPI } from '@/lib/api';
import { reportError } from '@/lib/utils';
import type { PublicProfile, ResponseModel } from '@/lib/types/apiResponses';

// keep your existing ApplicationStats type
type ApplicationStats = {
  total: number;
  accepted: number;
  rejected: number;
  waitlisted: number;
  acceptedPct: number;
};

type Props = {
  accessToken: string;
  userId: string;
  fetchedApplication: ResponseModel;
  fetchedDecision: ApplicationDecision;
  fetchedWaivers: ResponseModel[];
  stats: ApplicationStats;
  reviewer?: PublicProfile;
};

export default function ApplicationReviewClient({
  accessToken,
  userId,
  fetchedApplication,
  fetchedDecision,
  fetchedWaivers,
  stats,
  reviewer,
}: Props) {
  const applicants = useMemo(() => [fetchedApplication.user], [fetchedApplication]);
  const reviewerToUse = useMemo(() => reviewer, [reviewer]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // single source of truth for what ApplicationView displays
  const [currentDecision, setCurrentDecision] = useState<ApplicationDecision>(fetchedDecision);
  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>(
    fetchedApplication.user.applicationStatus
  );
  const [notes, setNotes] = useState<string>('');

  const [decisions, setDecisions] = useState<Record<number, ApplicationDecision>>({});
  const [notesByIndex, setNotesByIndex] = useState<Record<number, string>>({});

  const onPrev = () => setCurrentIndex(i => Math.max(0, i - 1));
  const onNext = () => setCurrentIndex(i => Math.min(applicants.length - 1, i + 1));

  const onReset = () => {
    setCurrentDecision(ApplicationDecision.NO_DECISION);
    setNotes('');

    setDecisions(prev => ({ ...prev, [currentIndex]: ApplicationDecision.NO_DECISION }));
    setNotesByIndex(prev => ({ ...prev, [currentIndex]: '' }));
  };

  const onSave = async () => {
    setIsSaving(true);
    try {
      if (currentStatus === ApplicationStatus.CONFIRMED) {
        showToast(
          "Couldn't update application decision",
          'User has already been confirmed for the hackathon.'
        );
        return;
      }

      await AdminAPI.updateApplicationDecision(accessToken, userId, currentDecision, notes);
      showToast('Saved', `Application marked as ${currentDecision}`);

      setDecisions(prev => ({ ...prev, [currentIndex]: currentDecision }));
      setNotesByIndex(prev => ({ ...prev, [currentIndex]: notes }));
      setNotes('');
    } catch (error) {
      reportError("Couldn't update application decision", error);
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
          stats={stats}
        />
      </div>

      <div className={styles.appReviewPanel}>
        <ApplicationReviewPanel
          applicant={applicants[currentIndex]}
          reviewer={reviewerToUse}
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
