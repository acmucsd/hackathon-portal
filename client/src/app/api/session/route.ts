import { cookies } from 'next/headers';
import { CookieType } from '@/lib/types/enums';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get(CookieType.USER)?.value || null;
    const user = userCookie ? JSON.parse(userCookie) : null;
    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ user: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
