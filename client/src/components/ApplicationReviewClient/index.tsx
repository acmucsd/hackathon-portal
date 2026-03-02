'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './style.module.scss';

import ApplicationView from '@/components/admin/ApplicationView';
import ApplicationReviewPanel from '@/components/ApplicationReviewPanel';
import { ApplicationDecision, ApplicationStatus } from '@/lib/types/enums';
import showToast from '@/lib/showToast';
import { AdminAPI } from '@/lib/api';
import { reportError } from '@/lib/utils';
import type { PublicProfile, ResponseModel } from '@/lib/types/apiResponses';

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
type ApplicantListItem = PublicProfile & {
  createdAt?: string | Date;
};

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

function recalculateStats(
  previousStats: ApplicationStats,
  fromDecision: ApplicationDecision,
  toDecision: ApplicationDecision
): ApplicationStats {
  if (fromDecision === toDecision) return previousStats;

  let accepted = previousStats.accepted;
  let rejected = previousStats.rejected;
  let waitlisted = previousStats.waitlisted;

  const fromKey = getStatsKey(fromDecision);
  const toKey = getStatsKey(toDecision);

  if (fromKey === 'accepted') accepted = Math.max(0, accepted - 1);
  if (fromKey === 'rejected') rejected = Math.max(0, rejected - 1);
  if (fromKey === 'waitlisted') waitlisted = Math.max(0, waitlisted - 1);

  if (toKey === 'accepted') accepted += 1;
  if (toKey === 'rejected') rejected += 1;
  if (toKey === 'waitlisted') waitlisted += 1;

  const acceptedPct = previousStats.total ? Math.round((accepted / previousStats.total) * 100) : 0;

  return {
    ...previousStats,
    accepted,
    rejected,
    waitlisted,
    acceptedPct,
  };
}

type Props = {
  accessToken: string;
  userId: string;
  fetchedApplication: ResponseModel;
  fetchedDecision: ApplicationDecision;
  fetchedReviewerComments: string | null;
  fetchedDecisionUpdatedAt?: string | Date | null;
  fetchedDecisionUpdatedBy?: PublicProfile;
  fetchedWaivers: ResponseModel[];
  stats: ApplicationStats;
  reviewer?: PublicProfile;
  currentUser?: PublicProfile;
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
  stats,
  reviewer,
  currentUser,
}: Props) {
  const router = useRouter();

  const [assignedApplicants, setAssignedApplicants] = useState<ApplicantListItem[]>([]);
  const [assignedReviewer, setAssignedReviewer] = useState<PublicProfile | undefined>(reviewer);
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

  useEffect(() => {
    const loadAssignments = async () => {
      if (!reviewer?.id) return;

      try {
        const assignments = await AdminAPI.getAssignmentsByReviewer(accessToken, reviewer.id);

        if (assignments.length > 0) {
          setAssignedApplicants(
            assignments.map(({ applicant }) => ({
              id: applicant.id,
              firstName: applicant.firstName,
              lastName: applicant.lastName,
              createdAt: applicant.createdAt,
            }))
          );

          const reviewerProfile = assignments[0].reviewer;
          if (reviewerProfile) {
            setAssignedReviewer({
              id: reviewerProfile.id,
              firstName: reviewerProfile.firstName,
              lastName: reviewerProfile.lastName,
            });
          }
        }
      } catch (error) {
        reportError("Couldn't load reviewer assignments", error);
      }
    };

    loadAssignments();
  }, [accessToken, reviewer?.id]);

  const applicants = useMemo(() => {
    const applicantsToSort =
      assignedApplicants.length > 0 ? assignedApplicants : [fetchedApplication.user];

    const parseCreatedAt = (value?: string | Date) => {
      if (!value) return Number.POSITIVE_INFINITY;
      const time = new Date(value).getTime();
      return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
    };

    return [...applicantsToSort].sort((a, b) => {
      const createdAtDiff = parseCreatedAt(a.createdAt) - parseCreatedAt(b.createdAt);
      if (createdAtDiff !== 0) return createdAtDiff;

      const lastNameDiff = a.lastName.localeCompare(b.lastName, undefined, {
        sensitivity: 'base',
      });
      if (lastNameDiff !== 0) return lastNameDiff;

      const firstNameDiff = a.firstName.localeCompare(b.firstName, undefined, {
        sensitivity: 'base',
      });
      if (firstNameDiff !== 0) return firstNameDiff;

      return a.id.localeCompare(b.id);
    });
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
      router.push(`/applicationView/${applicant.id}`);
    },
    [applicants, router]
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

      setLiveStats(prev => recalculateStats(prev, savedDecision, currentDecision));
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
