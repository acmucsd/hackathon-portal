import ApplicationView from '@/components/admin/ApplicationView';
import Typography from '@/components/Typography';
import { AdminAPI } from '@/lib/api';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import styles from './page.module.scss';

interface ApplicationReviewPageProps {
  params: Promise<{ uuid: string }>;
}

export default async function ApplicationReviewPage({ params }: ApplicationReviewPageProps) {
  const user = (await params).uuid;
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);
  const fetchedApplication = await AdminAPI.getApplication(accessToken, user);

  return (
    <main className={styles.main}>
      <Typography href="/review" variant="label/small">
        {'< Back to Dashboard'}
      </Typography>
      <ApplicationView responses={fetchedApplication.data} />
    </main>
  );
}
