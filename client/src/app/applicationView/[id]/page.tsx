import ApplicationReviewClient from '@/components/ApplicationReviewClient';
import { AdminAPI, UserAPI } from '@/lib/api';
import type {
  ResponseModelWithRevieweeProfile,
  ReviewAssignment,
  ReviewerOverviewResponse,
} from '@/lib/types/apiResponses';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType, ApplicationDecision } from '@/lib/types/enums';
import { filterApplicantsByCriteria } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { logout } from '@/lib/actions/logout';

function buildStats(
  reviewerOverview: ReviewerOverviewResponse,
  isSuperAdmin: boolean,
  reviewerProfileId?: string
) {
  if (isSuperAdmin) {
    const totals = reviewerOverview.reviewers.reduce(
      (acc, r) => ({
        total: acc.total + (r.total ?? 0),
        accept: acc.accept + (r.accept ?? 0),
        reject: acc.reject + (r.reject ?? 0),
        waitlist: acc.waitlist + (r.waitlist ?? 0),
        acceptedNonUcsd: acc.acceptedNonUcsd + (r.acceptedNonUcsd ?? 0),
      }),
      { total: 0, accept: 0, reject: 0, waitlist: 0, acceptedNonUcsd: 0 }
    );
    return {
      total: totals.total,
      accepted: totals.accept,
      rejected: totals.reject,
      waitlisted: totals.waitlist,
      acceptedPct: totals.total ? Math.round((totals.accept / totals.total) * 100) : 0,
      acceptedNonUcsd: totals.acceptedNonUcsd,
      acceptedNonUcsdPercentage: totals.accept
        ? Math.round((totals.acceptedNonUcsd / totals.accept) * 1000) / 10
        : 0,
    };
  }

  const r = reviewerOverview.reviewers.find(r => r.reviewerId === reviewerProfileId);
  return {
    total: r?.total ?? 0,
    accepted: r?.accept ?? 0,
    rejected: r?.reject ?? 0,
    waitlisted: r?.waitlist ?? 0,
    acceptedPct: r?.total ? Math.round((r.accept / r.total) * 100) : 0,
    acceptedNonUcsd: r?.acceptedNonUcsd ?? 0,
    acceptedNonUcsdPercentage: r?.acceptedNonUcsdPercentage ?? 0,
  };
}

type ApplicationReviewPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string; q?: string }>;
};

export default async function ApplicationReviewPage({
  params,
  searchParams,
}: ApplicationReviewPageProps) {
  const { id: userId } = await params;
  const { status: filterStatus, q: searchQuery } = await searchParams;

  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  if (!accessToken) {
    logout();
  }

  try {
    const currentUser = await UserAPI.getCurrentUser(accessToken);
    const isSuperAdmin = currentUser.accessType === 'SUPER_ADMIN';

    const fetchedApplication = await AdminAPI.getUserWithApplication(accessToken, userId);
    const [fetchedDecision, fetchedWaivers, allAssignments, reviewerOverview] = await Promise.all([
      AdminAPI.getApplicationDecision(accessToken, userId).catch(() => null as any),
      AdminAPI.getWaiversById(accessToken, userId).catch(() => []),
      isSuperAdmin
        ? AdminAPI.getAllAssignments(accessToken).catch(() => [] as ReviewAssignment[])
        : AdminAPI.getAssignmentsByReviewer(accessToken, currentUser.id).catch(
            () => [] as ReviewAssignment[]
          ),
      AdminAPI.getReviewerOverview(accessToken).catch(() => ({ reviewers: [] })),
    ]);

    // build the applicant list for sidebar navigation
    const allApplicants = allAssignments.map(({ applicant }) => applicant);
    const allAssignedApplicants = allAssignments
      .filter(a => a.reviewer != null)
      .map(({ applicant }) => applicant);

    // if filter criteria passed from dashboard, re-apply same filter logic to build nav list
    const assignedApplicants = filterStatus
      ? filterApplicantsByCriteria(allApplicants, filterStatus, searchQuery)
      : allAssignedApplicants;

    // determine which reviewer (if any) is assigned to this applicant
    const isAssigned = allAssignments.some(a => a.applicant.id === userId && a.reviewer != null);
    const reviewerProfile = isSuperAdmin
      ? allAssignments.find(a => a.applicant.id === userId && a.reviewer != null)?.reviewer
      : isAssigned
        ? currentUser
        : undefined;

    // this applicant
    const revieweeProfile = allAssignments.find(a => a.applicant.id === userId)!.applicant;
    const fetchedApplicationWithRevieweeProfile: ResponseModelWithRevieweeProfile = {
      ...fetchedApplication,
      user: revieweeProfile,
    };

    const stats = buildStats(reviewerOverview, isSuperAdmin, reviewerProfile?.id);

    return (
      <ApplicationReviewClient
        accessToken={accessToken}
        userId={userId}
        fetchedApplication={fetchedApplicationWithRevieweeProfile}
        fetchedDecision={fetchedDecision?.applicationDecision ?? ApplicationDecision.NO_DECISION}
        fetchedReviewerComments={fetchedDecision?.reviewerComments ?? ''}
        fetchedDecisionUpdatedAt={fetchedDecision?.updatedAt ?? null}
        fetchedDecisionUpdatedBy={fetchedDecision?.lastDecisionUpdatedBy}
        fetchedWaivers={fetchedWaivers}
        assignedApplicants={assignedApplicants}
        stats={stats}
        isSuperAdmin={isSuperAdmin}
        currentUser={currentUser}
        reviewer={reviewerProfile}
      />
    );
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 401) {
      logout();
    }
    if (status === 403) {
      redirect('/manageUsers');
    }
    throw err;
  }
}
