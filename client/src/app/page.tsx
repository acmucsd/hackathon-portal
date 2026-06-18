import { FAQ_QUESTIONS, TIMELINE } from '@/config';
import styles from './page.module.scss';
import Dashboard from '@/components/Dashboard';
import { UserAPI } from '@/lib/api';
import { ResponseAPI } from '@/lib/api';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  const headersList = await headers();
  const accessToken = headersList.get('x-access-token')!;

  let fetchedUser;
  try {
    fetchedUser = await UserAPI.getCurrentUser(accessToken);
  } catch (error) {
    console.error(error);
    return redirect('/api/logout');
  }

  try {
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
    return redirect('/api/logout');
  }
}
