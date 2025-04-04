import ApplicationView from '@/components/admin/ApplicationView';
import { AdminAPI } from '@/lib/api';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import { redirect } from 'next/navigation';
import styles from './page.module.scss';

interface ApplicationReviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicationReviewPage({ params }: ApplicationReviewPageProps) {
  const user = (await params).id;
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  if (!accessToken) {
    redirect('/login');
  }

  try {
    const fetchedApplication = await AdminAPI.getUserWithApplication(accessToken, user);
    const fetchedApplicationDecision = await AdminAPI.getApplicationDecision(accessToken, user);
    const fetchedWaivers = await AdminAPI.getWaiversById(accessToken, user).catch(() => []);

    return (
      <main className={styles.main}>
        <ApplicationView
          application={fetchedApplication}
          token={accessToken}
          decision={fetchedApplicationDecision.applicationDecision}
          waivers={fetchedWaivers}
        />
      </main>
    );
  } catch (error) {
    redirect('/login');
  }
}
