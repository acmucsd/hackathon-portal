import PhotoReleaseForm from '@/components/PhotoReleaseForm';
import { UserAPI } from '@/lib/api';
import { redirect } from 'next/navigation';
import styles from './page.module.scss';
import { canUserSubmitWaivers } from '@/lib/utils';
import { CookieType } from '@/lib/types/enums';
import { getCookie } from '@/lib/services/CookieService';

export default async function PhotoReleasePage() {
  const accessToken = (await getCookie(CookieType.ACCESS_TOKEN))!;

  let fetchedUser;
  try {
    fetchedUser = await UserAPI.getCurrentUser(accessToken);
  } catch (error) {
    console.error(error);
    redirect('/api/logout');
  }

  // Only allow accepted participants to fill out photo release form
  if (!canUserSubmitWaivers(fetchedUser!.applicationStatus)) {
    redirect('/');
  }

  return (
    <main className={styles.main}>
      <PhotoReleaseForm accessToken={accessToken} />
    </main>
  );
}
