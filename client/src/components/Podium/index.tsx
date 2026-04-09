import styles from './style.module.scss';
import Image from 'next/image';

interface PodiumProps {
  leaderboard: string[];
}

const FIXED_ORDER = ['SUN_GOD', 'RACCOON', 'TRITON', 'GEISEL'];

const heightByRank: { [rank: number]: number } = {
  1: 500,
  2: 375,
  3: 300,
  4: 200,
};

const RANK_TO_TIER: { [rank: number]: string } = {
  1: 'gold',
  2: 'silver',
  3: 'bronze',
  4: 'white',
};

export default function Podium({ leaderboard }: PodiumProps) {
  const rankOf: { [key: string]: number } = {};
  leaderboard.forEach((house, index) => {
    rankOf[house] = index + 1;
  });

  return (
    <div className={styles.podiumWrapper}>
      {FIXED_ORDER.map(house => {
        const rank = rankOf[house] ?? FIXED_ORDER.length;
        const imageSrc = `/assets/leaderboard/${house}.png`;
        const height = heightByRank[rank] ?? 200;
        const tier = RANK_TO_TIER[rank];

        return (
          <div
            key={house}
            className={`${styles.podiumSlot} ${styles[house.toLowerCase()]} ${rank === 4 ? styles.mobile_hidden : ''}`}
          >
            <div className={styles.mascotContainer}>
              {/* Desktop mascot */}
              <Image
                src={imageSrc}
                width={180 * (house === 'GEISEL' ? 1.4 : 1)}
                height={
                  200 *
                  (house === 'RACCOON'
                    ? 1.2
                    : house === 'TRITON'
                      ? 1.4
                      : house === 'SUN_GOD'
                        ? 1.1
                        : 1)
                }
                alt={house}
                className={`${styles.mascotImage} ${styles.desktopOnly}`}
              />

              {/* Mobile framed mascot */}
              <div className={styles.mobileOnly}>
                <div className={styles.frameContainer}>
                  <Image src={imageSrc} fill alt={house} className={styles.framedMascot} />
                  <Image
                    src={`/assets/leaderboard/${tier}_frame.png`}
                    fill
                    alt={`${tier} frame`}
                    className={styles.frameOverlay}
                  />
                </div>
                <Image
                  src={`/assets/leaderboard/${tier}_medal.png`}
                  width={36}
                  height={36}
                  alt={`Rank ${rank}`}
                  className={styles.medalImage}
                />
              </div>

              {rank === 1 && (
                <Image
                  src="/assets/leaderboard/GOBLET.png"
                  width={120}
                  height={180}
                  alt="Goblet"
                  className={`${styles.gobletImage} ${house === 'GEISEL' ? styles.gobletGeisel : ''}`}
                />
              )}
            </div>
            <div
              className={`${styles.column} ${rank === 1 ? styles.firstPlace : ''}`}
              style={{ height, '--column-height': `${height}px` } as React.CSSProperties}
            />
          </div>
        );
      })}
    </div>
  );
}
