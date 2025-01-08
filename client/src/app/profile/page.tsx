import { UserAPI } from '@/lib/api';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import Profile from '@/components/Profile';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  try {
    const fetchedUser = await UserAPI.getCurrentUser(accessToken);
    return <Profile user={fetchedUser} />;
  } catch (error) {
    redirect('/login');
  }
}
