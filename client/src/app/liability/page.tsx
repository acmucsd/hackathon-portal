import LiabilityForm from '@/components/LiabilityForm';
import { UserAPI } from '@/lib/api';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType, ApplicationStatus } from '@/lib/types/enums';
import { redirect } from 'next/navigation';
import styles from './page.module.scss';
import { canUserSubmitWaivers } from '@/lib/utils';

export default async function LiabilityPage() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  if (!accessToken) {
    redirect('/api/logout');
  }

  let fetchedUser;
  try {
    fetchedUser = await UserAPI.getCurrentUser(accessToken);
  } catch (error) {
    redirect('/api/logout');
  }

  // Only allow accepted participants to fill out liability form
  if (!canUserSubmitWaivers(fetchedUser.applicationStatus)) {
    redirect('/profile');
  }

  return (
    <main className={styles.main}>
      <LiabilityForm accessToken={accessToken} />
    </main>
  );
}
