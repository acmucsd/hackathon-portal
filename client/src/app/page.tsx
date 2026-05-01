import { FAQ_QUESTIONS, TIMELINE } from '@/config';
import styles from './page.module.scss';
import Dashboard from '@/components/Dashboard';
import { UserAPI } from '@/lib/api';
import { ResponseAPI } from '@/lib/api';
import { redirect } from 'next/navigation';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import { logout } from '@/lib/actions/logout';

export default async function Home() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  if (!accessToken) {
    logout();
  }

  try {
    const fetchedUser = await UserAPI.getCurrentUser(accessToken);
    const fetchedResponses = await ResponseAPI.getResponsesForCurrentUser(accessToken);

    return (
      <main className={styles.main}>
        <Dashboard
          faq={FAQ_QUESTIONS}
          timeline={TIMELINE}
          user={fetchedUser}
          responses={fetchedResponses}
        />
      </main>
    );
  } catch (error) {
    logout();
  }
}
