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

export default function Podium({ leaderboard }: PodiumProps) {
  const rankOf: { [key: string]: number } = {};
  leaderboard.forEach((house, index) => {
    rankOf[house] = index + 1;
  });

  return (
    <div className={styles.podiumWrapper}>
      {FIXED_ORDER.map((house) => {
        const rank = rankOf[house] ?? FIXED_ORDER.length;
        const imageSrc = `/assets/leaderboard/${house}.png`;
        const height = heightByRank[rank] ?? 200;

        return (
          <div key={house} className={`${styles.podiumSlot} ${styles[house.toLowerCase()]} ${rank === 4 ? styles.mobile_hidden : ''}`}>
            <div className={styles.mascotContainer}>
              <Image
                src={imageSrc}
                // make geisel bigger
                width={180 * (house === 'GEISEL' ? 1.4 : 1)}
                height={200 * (house === 'RACCOON' ? 1.2 : house === 'TRITON' ? 1.4 : house === 'SUN_GOD' ? 1.1 : 1)}
                alt={house}
                className={styles.mascotImage}
              />
              { rank == 1 &&
                <Image
                  src="/assets/leaderboard/goblet.png"
                  width={120}
                  height={180}
                  alt="Goblet"
                  className={`${styles.gobletImage} ${house === 'GEISEL' ? styles.gobletGeisel : ''}`}
                />
              }
            </div>
            <div className={styles.column} style={{ height }}>
            </div>
          </div>
        );
      })}
    </div>
  );
}