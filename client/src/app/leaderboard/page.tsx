import { getHouseLeaderboard } from '@/lib/api/LeaderboardAPI';
import styles from './page.module.scss';
import { redirect } from 'next/dist/client/components/navigation';
import { CookieType } from '@/lib/types/enums';
import { getCookie } from '@/lib/services/CookieService';

import Card from '@/components/Card';
import Podium from '@/components/Podium'; // adjust path as needed
import Image from 'next/image';

export default async function LeaderboardPage() {

  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);
  if (!accessToken) {
    redirect('/api/logout');
  }

  // note: index 0 = 1st place, index 1 = 2nd place, etc.
  // const leaderboard = await getHouseLeaderboard(accessToken);

  const leaderboard = ['SUN_GOD', 'RACCOON', 'TRITON', 'GEISEL']; // temporary hardcoded leaderboard until API is ready
  // const leaderboard = ['RACCOON', 'TRITON', 'GEISEL', 'SUN_GOD']; // temporary hardcoded leaderboard until API is ready
  // const leaderboard = ['TRITON', 'GEISEL', 'SUN_GOD', 'RACCOON']; // temporary hardcoded leaderboard until API is ready
  // const leaderboard = ['GEISEL', 'SUN_GOD', 'RACCOON', 'TRITON']; // temporary hardcoded leaderboard until API is ready


  const houseNames: { [key: string]: string } = {
    'GEISEL': 'Geisel',
    'SUN_GOD': 'Sun God',
    'RACCOON': 'Raccoon',
    'TRITON': 'King Triton',
  };

  return (
    <main className={styles.main}>
      <div className={styles.podiumContainer}>
        <Image src="/assets/leaderboard/confetti.png" width={1500} height={480} alt="Confetti"
         className={styles.confettiImage}/>
        <Podium leaderboard={leaderboard} />
      </div>

      <Card className={styles.container} gap={1.5}>
        <div className={styles.bannerContainer}>
          <Image src="/assets/leaderboard/banner.png" width={1131} height={220} alt="Banner"
          className={styles.bannerImage}
          />
          <h1 className={styles.leaderboardTitle}>Leaderboard</h1>
          <p className={styles.lastUpdated}>Last Updated: {new Date().toLocaleTimeString()}</p>
        </div>


        {leaderboard.map((house, index) => (
          <div key={index} className={styles.houseRow}>
            <span className={styles.rank}>{index + 1}{index == 0 ? 'st' : index == 1 ? 'nd' : index == 2 ? 'rd' : 'th'}</span>
            <span className={styles.houseName}>{houseNames[house]}</span>
          </div>
        ))}
      </Card>
    </main>
  );
}