import { redirect } from 'next/navigation';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import styles from './page.module.scss';
import CheckIn from '@/components/admin/CheckIn';

export default async function EventScan() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  if (!accessToken) {
    redirect('/login');
  }

  return (
    <div className={styles.main}>
      <CheckIn />
    </div>
  );
}
