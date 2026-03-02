import ApplicationReviewClient from '@/components/ApplicationReviewClient';
import { AdminAPI, UserAPI } from '@/lib/api';
import type { ReviewAssignment } from '@/lib/types/apiResponses';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType, ApplicationDecision } from '@/lib/types/enums';
import { redirect } from 'next/navigation';

type ApplicationReviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ApplicationReviewPage({ params }: ApplicationReviewPageProps) {
  const { id: userId } = await params;

  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  if (!accessToken) {
    redirect('/api/logout');
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

    // determine which reviewer (if any) is assigned to this applicant
    const isAssigned = allAssignments.some(a => a.applicant.id === userId);
    const reviewerProfile = isSuperAdmin
      ? allAssignments.find(a => a.applicant.id === userId)?.reviewer
      : isAssigned
        ? currentUser
        : undefined;

    let stats;
    if (isSuperAdmin) {
      // global stats across all reviewers
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
      stats = {
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
    } else {
      const reviewerStats = reviewerOverview.reviewers.find(
        r => r.reviewerId === reviewerProfile?.id
      );
      stats = {
        total: reviewerStats?.total ?? 0,
        accepted: reviewerStats?.accept ?? 0,
        rejected: reviewerStats?.reject ?? 0,
        waitlisted: reviewerStats?.waitlist ?? 0,
        acceptedPct: reviewerStats?.total
          ? Math.round((reviewerStats.accept / reviewerStats.total) * 100)
          : 0,
        acceptedNonUcsd: reviewerStats?.acceptedNonUcsd ?? 0,
        acceptedNonUcsdPercentage: reviewerStats?.acceptedNonUcsdPercentage ?? 0,
      };
    }

    return (
      <ApplicationReviewClient
        accessToken={accessToken}
        userId={userId}
        fetchedApplication={fetchedApplication}
        fetchedDecision={fetchedDecision?.applicationDecision ?? ApplicationDecision.NO_DECISION}
        fetchedReviewerComments={fetchedDecision?.reviewerComments ?? ''}
        fetchedDecisionUpdatedAt={fetchedDecision?.updatedAt ?? null}
        fetchedDecisionUpdatedBy={fetchedDecision?.lastDecisionUpdatedBy}
        fetchedWaivers={fetchedWaivers}
        stats={stats}
        isSuperAdmin={isSuperAdmin}
        currentUser={
          currentUser
            ? {
                id: currentUser.id,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
              }
            : undefined
        }
        reviewer={
          reviewerProfile
            ? {
                id: reviewerProfile.id,
                firstName: reviewerProfile.firstName,
                lastName: reviewerProfile.lastName,
              }
            : undefined
        }
      />
    );
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 401) {
      redirect('/api/logout');
    }
    if (status === 403) {
      redirect('/manageUsers');
    }
    throw err;
  }
}
