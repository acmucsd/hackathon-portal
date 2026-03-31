'use client';

import styles from './style.module.scss';
import Card from '@/components/Card';
import Podium from '@/components/Podium';
import LastUpdated from '@/components/LastUpdated';
import Image from 'next/image';
import RankChangeBadge from '@/components/LeaderboardChangeBadge';
import { useLeaderboardDiff } from '@/lib/hooks/useLeaderboardDiff';
import React from 'react';

const houseNames: { [key: string]: string } = {
  GEISEL: 'Geisel',
  SUN_GOD: 'Sun God',
  RACCOON: 'Raccoon',
  TRITON: 'King Triton',
};

const RANK_TO_TIER: { [rank: number]: string } = {
  1: 'gold',
  2: 'silver',
  3: 'bronze',
  4: 'white',
};

interface Props {
  leaderboard: string[];
}

export default function LeaderboardClient({ leaderboard }: Props) {
  const diffs = useLeaderboardDiff(leaderboard);

  return (
    <main className={styles.main}>
      <div className={styles.podiumContainer}>
        <Image
          src="/assets/leaderboard/confetti.png"
          width={1500}
          height={480}
          alt="Confetti"
          className={styles.confettiImage}
        />
        <Image
          src="/assets/leaderboard/confetti_mobile.png"
          width={200}
          height={150}
          alt="Confetti"
          className={styles.confettiImageMobile}
        />
        <Podium leaderboard={leaderboard} />
      </div>

      <Card className={styles.container} gap={1.5}>
        <div className={styles.bannerContainer}>
          <Image
            src="/assets/leaderboard/banner.png"
            width={1131}
            height={220}
            alt="Banner"
            className={`${styles.bannerImage} ${styles.bannerDesktop}`}
          />
          <Image
            src="/assets/leaderboard/banner_mobile.png"
            width={600}
            height={220}
            alt="Banner"
            className={`${styles.bannerImage} ${styles.bannerMobile}`}
          />
          <h1 className={styles.leaderboardTitle}>Leaderboard</h1>
          <LastUpdated />
        </div>

        {leaderboard.map((house, index) => {
          const suffix = index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th';
          const isFirst = index === 0;
          const rankChange = diffs.find(d => d.house === house);

          return (
            <React.Fragment key={house}>
              <div className={`${styles.houseRow} ${isFirst ? styles.firstPlace : ''}`}>
                <span className={styles.rank}>
                  {index + 1}
                  <span className={styles.suffix}>{suffix}</span>
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
                <RankChangeBadge rankChange={rankChange} />
              </div>
              {isFirst && <div className={styles.divider} />}
            </React.Fragment>
          );
        })}
      </Card>
    </main>
  );
}
