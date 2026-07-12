import { logoutAction } from '@/lib/actions/logout';

export async function GET() {
  await logoutAction();
}
