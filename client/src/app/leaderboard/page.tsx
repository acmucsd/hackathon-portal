import { getHouseLeaderboard } from '@/lib/api/LeaderboardAPI';
import { redirect } from 'next/dist/client/components/navigation';
import { CookieType } from '@/lib/types/enums';
import { getCookie } from '@/lib/services/CookieService';
import LeaderboardClient from '@/components/LeaderboardClient';
import { logout } from '@/lib/actions/logout';

export default async function LeaderboardPage() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);
  if (!accessToken) {
    logout();
  }
  try {
    const leaderboard = await getHouseLeaderboard(accessToken);
    if (typeof leaderboard === 'string') {
      logout();
    }
    return <LeaderboardClient leaderboard={leaderboard} />;
  } catch (error) {
    logout();
  }
}
