import LiabilityForm from '@/components/LiabilityForm';
import { UserAPI } from '@/lib/api';
import { redirect } from 'next/navigation';
import styles from './page.module.scss';
import { canUserSubmitWaivers } from '@/lib/utils';
import config from '@/lib/config';
import { headers } from 'next/headers';

export default async function LiabilityPage() {
  const headersList = await headers();
  const accessToken = headersList.get(config.header.accessToken)!;

  let fetchedUser;
  try {
    fetchedUser = await UserAPI.getCurrentUser(accessToken);
  } catch (error) {
    console.error(error);
    redirect('/api/logout');
  }

  // Only allow accepted participants to fill out liability form
  if (!canUserSubmitWaivers(fetchedUser!.applicationStatus)) {
    redirect('/');
  }

  return (
    <main className={styles.main}>
      <LiabilityForm accessToken={accessToken} />
    </main>
  );
}
