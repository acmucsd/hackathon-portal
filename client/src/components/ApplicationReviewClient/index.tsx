'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './style.module.scss';

import ApplicationView from '@/components/admin/ApplicationView';
import ApplicationReviewPanel from '@/components/ApplicationReviewPanel';
import { ApplicationDecision, ApplicationStatus } from '@/lib/types/enums';
import showToast from '@/lib/showToast';
import { AdminAPI } from '@/lib/api';
import { reportError, sortRevieweeProfiles } from '@/lib/utils';
import type {
  PublicProfile,
  RevieweeProfile,
  ResponseModel,
  ResponseModelWithRevieweeProfile,
} from '@/lib/types/apiResponses';
import type { Application } from '@/lib/types/application';

type ApplicationStats = {
  total: number;
  accepted: number;
  rejected: number;
  waitlisted: number;
  acceptedPct: number;
  acceptedNonUcsd: number;
  acceptedNonUcsdPercentage: number;
};

type DecisionStatsKey = 'accepted' | 'rejected' | 'waitlisted';

function getStatsKey(decision: ApplicationDecision): DecisionStatsKey | null {
  switch (decision) {
    case ApplicationDecision.ACCEPT:
      return 'accepted';
    case ApplicationDecision.REJECT:
      return 'rejected';
    case ApplicationDecision.WAITLIST:
      return 'waitlisted';
    default:
      return null;
  }
}

const UCSD = 'University of California, San Diego';

function recalculateStats(
  previousStats: ApplicationStats,
  fromDecision: ApplicationDecision,
  toDecision: ApplicationDecision,
  isNonUcsd: boolean
): ApplicationStats {
  if (fromDecision === toDecision) return previousStats;

  let accepted = previousStats.accepted;
  let rejected = previousStats.rejected;
  let waitlisted = previousStats.waitlisted;
  let acceptedNonUcsd = previousStats.acceptedNonUcsd;

  const fromKey = getStatsKey(fromDecision);
  const toKey = getStatsKey(toDecision);

  if (fromKey === 'accepted') {
    accepted = Math.max(0, accepted - 1);
    if (isNonUcsd) acceptedNonUcsd = Math.max(0, acceptedNonUcsd - 1);
  }
  if (fromKey === 'rejected') rejected = Math.max(0, rejected - 1);
  if (fromKey === 'waitlisted') waitlisted = Math.max(0, waitlisted - 1);

  if (toKey === 'accepted') {
    accepted += 1;
    if (isNonUcsd) acceptedNonUcsd += 1;
  }
  if (toKey === 'rejected') rejected += 1;
  if (toKey === 'waitlisted') waitlisted += 1;

  const acceptedPct = previousStats.total ? Math.round((accepted / previousStats.total) * 100) : 0;
  const acceptedNonUcsdPercentage = accepted
    ? Math.round((acceptedNonUcsd / accepted) * 1000) / 10
    : 0;

  return {
    ...previousStats,
    accepted,
    rejected,
    waitlisted,
    acceptedPct,
    acceptedNonUcsd,
    acceptedNonUcsdPercentage,
  };
}

type Props = {
  accessToken: string;
  userId: string;
  fetchedApplication: ResponseModelWithRevieweeProfile;
  fetchedDecision: ApplicationDecision;
  fetchedReviewerComments: string | null;
  fetchedDecisionUpdatedAt?: string | Date | null;
  fetchedDecisionUpdatedBy?: PublicProfile;
  fetchedWaivers: ResponseModel[];
  assignedApplicants?: RevieweeProfile[];
  stats: ApplicationStats;
  reviewer?: PublicProfile;
  currentUser?: PublicProfile;
  isSuperAdmin?: boolean;
};

export default function ApplicationReviewClient({
  accessToken,
  userId,
  fetchedApplication,
  fetchedDecision,
  fetchedReviewerComments,
  fetchedDecisionUpdatedAt,
  fetchedDecisionUpdatedBy,
  fetchedWaivers,
  assignedApplicants: initialAssignedApplicants = [],
  stats,
  reviewer,
  currentUser,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNonUcsd = (fetchedApplication.data as Application)?.university !== UCSD;

  const [assignedApplicants, setAssignedApplicants] =
    useState<RevieweeProfile[]>(initialAssignedApplicants);
  const [assignedReviewer] = useState<PublicProfile | undefined>(reviewer);
  const [isSaving, setIsSaving] = useState(false);

  // single source of truth for what ApplicationView displays
  const [currentDecision, setCurrentDecision] = useState<ApplicationDecision>(fetchedDecision);
  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>(
    fetchedApplication.user.applicationStatus
  );
  const [notes, setNotes] = useState<string>(fetchedReviewerComments ?? '');
  const [liveStats, setLiveStats] = useState<ApplicationStats>(stats);
  const [savedDecision, setSavedDecision] = useState<ApplicationDecision>(fetchedDecision);
  const [lastSavedAt, setLastSavedAt] = useState<string | Date | null>(
    fetchedDecisionUpdatedAt ?? null
  );
  const [lastSavedBy, setLastSavedBy] = useState<PublicProfile | undefined>(
    fetchedDecisionUpdatedBy
  );

  useEffect(() => {
    setNotes(fetchedReviewerComments ?? '');
    setLastSavedAt(fetchedDecisionUpdatedAt ?? null);
    setLastSavedBy(fetchedDecisionUpdatedBy);
  }, [fetchedReviewerComments, fetchedDecisionUpdatedAt, fetchedDecisionUpdatedBy, userId]);

  const applicants = useMemo(() => {
    const applicantsToSort =
      assignedApplicants.length > 0 ? assignedApplicants : [fetchedApplication.user];

    return [...applicantsToSort].sort(sortRevieweeProfiles);
  }, [assignedApplicants, fetchedApplication.user]);

  const currentIndex = useMemo(() => {
    const idx = applicants.findIndex(applicant => applicant.id === userId);
    return idx >= 0 ? idx : 0;
  }, [applicants, userId]);

  const activeApplicant = applicants[currentIndex] ?? fetchedApplication.user;
  const reviewerToUse = assignedReviewer ?? reviewer;

  const goToApplicant = useCallback(
    (index: number) => {
      const applicant = applicants[index];
      if (!applicant) return;
      const status = searchParams.get('status');
      const q = searchParams.get('q');
      const qs =
        status !== null
          ? `?status=${encodeURIComponent(status)}&q=${encodeURIComponent(q ?? '')}`
          : '';
      router.push(`/applicationView/${applicant.id}${qs}`);
    },
    [applicants, router, searchParams]
  );

  const onPrev = () => goToApplicant(Math.max(0, currentIndex - 1));
  const onNext = () => goToApplicant(Math.min(applicants.length - 1, currentIndex + 1));

  const onReset = () => {
    setCurrentDecision(ApplicationDecision.NO_DECISION);
    setNotes('');
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

      const updatedUser = await AdminAPI.updateApplicationDecision(
        accessToken,
        userId,
        currentDecision,
        notes
      );
      showToast('Saved successfully!', `Application marked as ${currentDecision}`);

      setLiveStats(prev => recalculateStats(prev, savedDecision, currentDecision, isNonUcsd));
      setSavedDecision(currentDecision);
      setNotes(updatedUser.reviewerComments ?? '');
      setLastSavedAt(updatedUser.updatedAt ?? new Date().toISOString());
      setLastSavedBy(updatedUser.lastDecisionUpdatedBy ?? currentUser);
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
          stats={liveStats}
        />
      </div>

      <div className={styles.appReviewPanel}>
        <ApplicationReviewPanel
          applicant={activeApplicant}
          reviewer={reviewerToUse}
          savedBy={lastSavedBy}
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
          lastSavedAt={lastSavedAt}
        />
      </div>
    </main>
  );
}
