import ApplicationReviewClient from '@/components/ApplicationReviewClient';
import { AdminAPI } from '@/lib/api';
import type { ReviewAssignment } from '@/lib/types/apiResponses';
import { cookies } from 'next/headers';
import { CookieType, ApplicationDecision } from '@/lib/types/enums';
import { redirect } from 'next/navigation';

type ApplicationReviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ApplicationReviewPage({ params }: ApplicationReviewPageProps) {
  const { id: userId } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(CookieType.ACCESS_TOKEN)?.value;

  if (!accessToken) {
    // no token -> go to login directly (no need to clear anything)
    redirect('/login');
  }

  try {
    const fetchedApplication = await AdminAPI.getUserWithApplication(accessToken, userId);
    const [fetchedDecision, fetchedWaivers, allAssignments, reviewerOverview] = await Promise.all([
      AdminAPI.getApplicationDecision(accessToken, userId).catch(() => null as any),
      AdminAPI.getWaiversById(accessToken, userId).catch(() => []),
      AdminAPI.getAllAssignments(accessToken).catch(() => [] as ReviewAssignment[]),
      AdminAPI.getReviewerOverview(accessToken).catch(() => ({ reviewers: [] })),
    ]);

    // determine which reviewer (if any) is assigned to this applicant
    const assigned = allAssignments.find(a => a.applicant.id === userId);
    const reviewerProfile = assigned?.reviewer;

    const reviewerStats = reviewerOverview.reviewers.find(
      reviewer => reviewer.reviewerId === reviewerProfile?.id
    );

    const stats = {
      total: reviewerStats?.total ?? 0,
      accepted: reviewerStats?.accept ?? 0,
      rejected: reviewerStats?.reject ?? 0,
      waitlisted: reviewerStats?.waitlist ?? 0,
      acceptedPct: reviewerStats?.total
        ? Math.round((reviewerStats.accept / reviewerStats.total) * 100)
        : 0,
    };

    return (
      <ApplicationReviewClient
        accessToken={accessToken}
        userId={userId}
        fetchedApplication={fetchedApplication}
        fetchedDecision={fetchedDecision?.applicationDecision ?? ApplicationDecision.NO_DECISION}
        fetchedWaivers={fetchedWaivers}
        stats={stats}
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
