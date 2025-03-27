import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import PhotoReleaseForm from '@/components/PhotoReleaseForm';
import { redirect } from 'next/navigation';
import styles from './page.module.scss';

export default async function PhotoReleasePage() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  if (!accessToken) {
    redirect('/api/logout');
  }

  return (
    <main className={styles.main}>
      <PhotoReleaseForm accessToken={accessToken} />
    </main>
  );
}
