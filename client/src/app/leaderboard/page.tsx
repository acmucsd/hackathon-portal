import { getHouseLeaderboard } from '@/lib/api/LeaderboardAPI';
import LeaderboardClient from '@/components/LeaderboardClient';
import { headers } from 'next/headers';
import config from '@/lib/config';
import { redirect } from 'next/navigation';

export default async function LeaderboardPage() {
  const headersList = await headers();
  const accessToken = headersList.get(config.header.accessToken)!;

  try {
    const leaderboard = await getHouseLeaderboard(accessToken);
    if (typeof leaderboard === 'string') {
      redirect('/');
    }
    return <LeaderboardClient leaderboard={leaderboard} />;
  } catch (error) {
    console.error(error);
    redirect('/');
  }
}
