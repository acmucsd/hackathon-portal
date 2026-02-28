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
    const fetchedDecision = await AdminAPI.getApplicationDecision(accessToken, userId).catch(
      () => null as any
    );
    const fetchedWaivers = await AdminAPI.getWaiversById(accessToken, userId).catch(() => []);

    // pull all applications so we can compute simple statistics for the admin panel
    const allApplications = await AdminAPI.getApplications(accessToken).catch(
      () => [] as (typeof fetchedApplication)[]
    );

    // determine which reviewer (if any) is assigned to this applicant
    const allAssignments = await AdminAPI.getAllAssignments(accessToken).catch(
      () => [] as ReviewAssignment[]
    );
    const assigned = allAssignments.find(a => a.applicant.id === userId);
    const reviewerProfile = assigned?.reviewer;

    const stats = {
      total: allApplications.length,
      accepted: allApplications.filter(
        app => (app.user as any)?.applicationDecision === ApplicationDecision.ACCEPT
      ).length,
      rejected: allApplications.filter(
        app => (app.user as any)?.applicationDecision === ApplicationDecision.REJECT
      ).length,
      waitlisted: allApplications.filter(
        app => (app.user as any)?.applicationDecision === ApplicationDecision.WAITLIST
      ).length,
      acceptedPct: 0,
    };
    stats.acceptedPct = stats.total ? Math.round((stats.accepted / stats.total) * 100) : 0;

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
