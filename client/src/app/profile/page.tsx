import { UserAPI, ResponseAPI } from '@/lib/api';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import Profile from '@/components/Profile';
import { redirect } from 'next/navigation';
import styles from './page.module.scss';

export default async function ProfilePage() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  try {
    const fetchedUser = await UserAPI.getCurrentUser(accessToken);
    const fetchedResponses = await ResponseAPI.getResponsesForCurrentUser(accessToken);
    return (
      <main className={styles.main}>
        <Profile user={fetchedUser} responses={fetchedResponses} />
      </main>
    );
  } catch (error) {
    redirect('/api/logout');
  }
}
