import RSVPForm from '@/components/RSVPForm';
import { UserAPI } from '@/lib/api';
import { redirect } from 'next/navigation';
import styles from './page.module.scss';
import { canUserSubmitWaivers } from '@/lib/utils';
import { headers } from 'next/headers';
import config from '@/lib/config';

export default async function RSVPPage() {
  const headersList = await headers();
  const accessToken = headersList.get(config.header.accessToken)!;

  let fetchedUser;
  try {
    fetchedUser = await UserAPI.getCurrentUser(accessToken);
  } catch (error) {
    console.error(error);
    redirect('/api/logout');
  }

  // Only allow accepted participants to fill out RSVP form
  if (!canUserSubmitWaivers(fetchedUser!.applicationStatus)) {
    redirect('/');
  }

  return (
    <main className={styles.main}>
      <RSVPForm accessToken={accessToken} />
    </main>
  );
}
