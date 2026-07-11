import { UserAPI, ResponseAPI } from '@/lib/api';
import Profile from '@/components/Profile';
import styles from './page.module.scss';
import { redirect } from 'next/navigation';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';

export default async function ProfilePage() {
  const accessToken = (await getCookie(CookieType.ACCESS_TOKEN))!;

  let fetchedUser;
  try {
    fetchedUser = await UserAPI.getCurrentUser(accessToken);
  } catch (error) {
    console.error(error);
    redirect('/api/logout');
  }

  try {
    const fetchedResponses = await ResponseAPI.getResponsesForCurrentUser(accessToken);
    return (
      <main className={styles.main}>
        <Profile user={fetchedUser} responses={fetchedResponses} />
      </main>
    );
  } catch (error) {
    console.error(error);
    redirect('/');
  }
}
