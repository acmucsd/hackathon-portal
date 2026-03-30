import { getHouseLeaderboard } from '@/lib/api/LeaderboardAPI';
import styles from './page.module.scss';
import { redirect } from 'next/dist/client/components/navigation';
import { CookieType } from '@/lib/types/enums';
import { getCookie } from '@/lib/services/CookieService';

import Card from '@/components/Card';

export default async function LeaderboardPage() {

  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);
  if (!accessToken) {
    redirect('/api/logout');
  }

  // note: index 0 = 1st place, index 1 = 2nd place, etc.
  const leaderboard = await getHouseLeaderboard(accessToken);

  const houseNames: { [key: string]: string } = {
    'GEISEL': 'Geisel',
    'SUN_GOD': 'Sun God',
    'RACCOON': 'Raccoon',
    'TRITON': 'King Triton',
  };

  return (
    <main className={styles.main}>
      <Card className={styles.container} gap={1.5}>

        <h1>Leaderboard</h1>
      </Card>
    </main>
  );
}