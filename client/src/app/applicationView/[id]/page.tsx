import ApplicationReviewClient from '@/components/ApplicationReviewClient';
import { AdminAPI } from '@/lib/api';
import { cookies } from 'next/headers';
import { CookieType } from '@/lib/types/enums';
import { redirect } from 'next/navigation';

type ApplicationReviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ApplicationReviewPage({ params }: ApplicationReviewPageProps) {
  const userId = (await params).id;

  const accessToken = cookies().get(CookieType.ACCESS_TOKEN)?.value;
  if (!accessToken) redirect('/api/logout');

  try {
    const fetchedApplication = await AdminAPI.getUserWithApplication(accessToken, userId);
    const fetchedDecision = await AdminAPI.getApplicationDecision(accessToken, userId);
    const fetchedWaivers = await AdminAPI.getWaiversById(accessToken, userId).catch(() => []);

    return (
      <ApplicationReviewClient
        accessToken={accessToken}
        userId={userId}
        fetchedApplication={fetchedApplication}
        fetchedDecision={fetchedDecision.applicationDecision}
        fetchedWaivers={fetchedWaivers}
      />
    );
  } catch {
    redirect('/api/logout');
  }
}
