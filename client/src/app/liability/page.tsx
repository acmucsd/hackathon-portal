import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import LiabilityForm from '@/components/LiabilityForm';
import { redirect } from 'next/navigation';
import styles from './page.module.scss';

export default async function LiabilityPage() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  if (!accessToken) {
    redirect('/api/logout');
  }

  return (
    <main className={styles.main}>
      <LiabilityForm accessToken={accessToken} />
    </main>
  );
}
