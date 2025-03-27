import LiabilityForm from '@/components/LiabilityForm';
import { UserAPI } from '@/lib/api';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType, ApplicationStatus } from '@/lib/types/enums';
import { redirect } from 'next/navigation';
import styles from './page.module.scss';

export default async function LiabilityPage() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  if (!accessToken) {
    redirect('/api/logout');
  }

  try {
    const fetchedUser = await UserAPI.getCurrentUser(accessToken);

    // Only allow accepted participants to fill out liability form
    if (fetchedUser.applicationStatus !== ApplicationStatus.ACCEPTED) {
      redirect('/profile');
    }

    return (
      <main className={styles.main}>
        <LiabilityForm accessToken={accessToken} />
      </main>
    );
  } catch (error) {
    redirect('/api/logout');
  }
}
