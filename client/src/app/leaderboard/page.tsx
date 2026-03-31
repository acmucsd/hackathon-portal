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
  const leaderboard = await getHouseLeaderboard(accessToken);

  const houseNames: { [key: string]: string } = {
    'GEISEL': 'Geisel',
    'SUN_GOD': 'Sun God',
    'RACCOON': 'Raccoon',
    'TRITON': 'King Triton',
  };

  const RANK_TO_TIER: { [rank: number]: string } = {
    1: 'gold',
    2: 'silver',
    3: 'bronze',
    4: 'white',
  };

  return (
    <main className={styles.main}>
      {/* Podium */}
      <div className={styles.podiumContainer}>
        {/* desktop */}
        <Image src="/assets/leaderboard/confetti.png" width={1500} height={480} alt="Confetti"
          className={styles.confettiImage} />
        {/* mobile */}
        <Image src="/assets/leaderboard/confetti_mobile.png" width={200} height={150} alt="Confetti"
          className={styles.confettiImageMobile} />
        <Podium leaderboard={leaderboard} />
      </div>

      <Card className={styles.container} gap={1.5}>
        {/* Banner */}
        <div className={styles.bannerContainer}>
          {/* Desktop banner */}
          <Image src="/assets/leaderboard/banner.png" width={1131} height={220} alt="Banner"
            className={`${styles.bannerImage} ${styles.bannerDesktop}`} />
          {/* Mobile banner */}
          <Image src="/assets/leaderboard/banner_mobile.png" width={600} height={220} alt="Banner"
            className={`${styles.bannerImage} ${styles.bannerMobile}`} />
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
                <div className={styles.mascotWrapper}>
                  <Image
                    src={`/assets/leaderboard/${house}.png`}
                    width={500}
                    height={500}
                    alt={houseNames[house]}
                    className={styles.mascotImage}
                  />
                  <Image
                    src={`/assets/leaderboard/${RANK_TO_TIER[index + 1]}_frame.png`}
                    fill
                    alt="frame"
                    className={styles.frameOverlay}
                  />
                </div>
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