import { FAQ_QUESTIONS, TIMELINE } from '@/config';
import styles from './page.module.scss';
import Dashboard from '@/components/Dashboard';
import { UserAPI } from '@/lib/api';
import { redirect } from 'next/navigation';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import { getCurrentUser } from './api/getCurrentUser/route';
import { getErrorMessage } from '@/lib/utils';

export default async function Home() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);
  console.log('HI THERE');
  console.log(accessToken);

  try {
    const response = await getCurrentUser(accessToken);

    console.log(response.user);
    const fetchedUser = response.user;
    return (
      <main className={styles.main}>
        <Dashboard faq={FAQ_QUESTIONS} timeline={TIMELINE} user={fetchedUser} />
      </main>
    );
  } catch (error) {
    console.error(getErrorMessage(error));
    return <main>this is broken</main>;
    redirect('/login');
  }
}
