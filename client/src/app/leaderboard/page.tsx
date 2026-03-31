import { getHouseLeaderboard } from '@/lib/api/LeaderboardAPI';
import styles from './page.module.scss';
import { redirect } from 'next/dist/client/components/navigation';
import { CookieType } from '@/lib/types/enums';
import { getCookie } from '@/lib/services/CookieService';

import Card from '@/components/Card';
import Podium from '@/components/Podium';
import LastUpdated from '@/components/LastUpdated';
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

  const timeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  const updatedAt = new Date();

  return (
    <main>
      {/* Podium */}
      <div className={styles.podiumContainer}>
        <Image src="/assets/leaderboard/confetti.png" width={1500} height={480} alt="Confetti"
          className={styles.confettiImage} />
        <Podium leaderboard={leaderboard} />
      </div>

      <Card className={styles.container} gap={1.5}>
        {/* Banner */}
        <div className={styles.bannerContainer}>
          <Image src="/assets/leaderboard/banner.png" width={1131} height={220} alt="Banner"
            className={styles.bannerImage} />
          <h1 className={styles.leaderboardTitle}>Leaderboard</h1>
          <LastUpdated />
        </div>

        {/* Leaderboard items */}
        {leaderboard.map((house, index) => {
          const suffix = index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th';
          const isFirst = index === 0;

          return (
            <>
              <div key={index} className={`${styles.houseRow} ${isFirst ? styles.firstPlace : ''}`}>
                <span className={styles.rank}>
                  {index + 1}<span className={styles.suffix}>{suffix}</span>
                </span>
                <Image
                  src={`/assets/leaderboard/${house}_button.png`}
                  width={500}
                  height={500}
                  alt={houseNames[house]}
                  className={styles.mascotImage}
                />
                <span className={styles.houseName}>{houseNames[house]}</span>
              </div>
              {isFirst && <div className={styles.divider} />}
            </>
          );
        })}

      </Card>
    </main>
  );
}