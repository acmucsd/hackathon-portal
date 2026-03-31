import { getHouseLeaderboard } from '@/lib/api/LeaderboardAPI';
import { redirect } from 'next/dist/client/components/navigation';
import { CookieType } from '@/lib/types/enums';
import { getCookie } from '@/lib/services/CookieService';
import LeaderboardClient from '@/components/LeaderboardClient';

export default async function LeaderboardPage() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);
  if (!accessToken) {
    redirect('/api/logout');
  }
  try {
    const leaderboard = await getHouseLeaderboard(accessToken);
    return <LeaderboardClient leaderboard={leaderboard} />;
  } catch (error) {
    redirect('/api/logout');
  }
}
