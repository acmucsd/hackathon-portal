import { HouseRankChange } from '@/lib/hooks/useLeaderboardDiff';
import Image from 'next/image';
import styles from './style.module.scss';

interface Props {
  rankChange: HouseRankChange | undefined;
}

export default function RankChangeBadge({ rankChange }: Props) {
  if (!rankChange || rankChange.change === 'new' || rankChange.change === 'same') return null;

  const isUp = rankChange.change === 'up';

  return (
    <Image
      src={`/assets/leaderboard/${isUp ? 'up' : 'down'}.png`}
      width={100}
      height={100}
      alt="Change"
      className={styles.changeImage}
    />
  );
}
