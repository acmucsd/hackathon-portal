import { UserAPI, ResponseAPI } from '@/lib/api';
import Profile from '@/components/Profile';
import styles from './page.module.scss';
import { headers } from 'next/headers';
import config from '@/lib/config';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const headersList = await headers();
  const accessToken = headersList.get(config.header.accessToken)!;

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
