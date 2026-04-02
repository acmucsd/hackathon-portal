import { useEffect, useState } from 'react';

const STORAGE_KEY = 'leaderboard_previous';

export type RankChange = 'up' | 'down' | 'same' | 'new';

export interface HouseRankChange {
  house: string;
  change: RankChange;
  delta: number; // how many positions moved (positive = up, negative = down)
}

export const useLeaderboardDiff = (currentLeaderboard: string[]): HouseRankChange[] => {
  const [diffs, setDiffs] = useState<HouseRankChange[]>([]);
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const previous: string[] = stored ? JSON.parse(stored) : [];
    const hasChanged = currentLeaderboard.some((house, i) => house !== previous[i]);
    const changes: HouseRankChange[] = currentLeaderboard.map((house, currentIndex) => {
      const previousIndex = previous.indexOf(house);
      const delta = previousIndex - currentIndex;
      const change: RankChange =
        previousIndex === -1 ? 'new' : delta > 0 ? 'up' : delta < 0 ? 'down' : 'same';
      return { house, change, delta };
    });

    setDiffs(changes);

    if (hasChanged && previous.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentLeaderboard));
    } else if (previous.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentLeaderboard));
    }
  }, [currentLeaderboard]);

  return diffs;
};
