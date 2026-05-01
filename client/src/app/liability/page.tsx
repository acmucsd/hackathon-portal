import LiabilityForm from '@/components/LiabilityForm';
import { UserAPI } from '@/lib/api';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType, ApplicationStatus } from '@/lib/types/enums';
import { redirect } from 'next/navigation';
import styles from './page.module.scss';
import { canUserSubmitWaivers } from '@/lib/utils';
import { logout } from '@/lib/actions/logout';

export default async function LiabilityPage() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  if (!accessToken) {
    logout();
  }

  let fetchedUser;
  try {
    fetchedUser = await UserAPI.getCurrentUser(accessToken);
  } catch (error) {
    logout();
  }

  // Only allow accepted participants to fill out liability form
  if (!canUserSubmitWaivers(fetchedUser!.applicationStatus)) {
    redirect('/');
  }

  return (
    <main className={styles.main}>
      <LiabilityForm accessToken={accessToken} />
    </main>
  );
}
