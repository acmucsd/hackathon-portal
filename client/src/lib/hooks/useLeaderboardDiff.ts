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

    const changes: HouseRankChange[] = currentLeaderboard.map((house, currentIndex) => {
      const previousIndex = previous.indexOf(house);

      if (previousIndex === -1) {
        return { house, change: 'new', delta: 0 };
      }

      const delta = previousIndex - currentIndex; // positive = moved up, negative = moved down
      const change: RankChange = delta > 0 ? 'up' : delta < 0 ? 'down' : 'same';

      return { house, change, delta };
    });

    setDiffs(changes);

    // Save current as the new "previous" for next update
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentLeaderboard));
  }, [currentLeaderboard]);

  return diffs;
};