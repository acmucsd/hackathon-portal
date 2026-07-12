import { getHouseLeaderboard } from '@/lib/api/LeaderboardAPI';
import LeaderboardClient from '@/components/LeaderboardClient';
import { redirect } from 'next/navigation';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';

export default async function LeaderboardPage() {
  const accessToken = (await getCookie(CookieType.ACCESS_TOKEN))!;

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
