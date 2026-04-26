import config from '@/lib/config';
import {
  authCookieOptions,
  deleteUserCookies,
} from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { PrivateProfile, VerifyTokenResponse } from '@/lib/types/apiResponses';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CookieType.ACCESS_TOKEN)?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  const verifyTokenUrl = `${config.api.baseUrl}${config.api.endpoints.auth.verifyToken}`;
  const verifyResponse = await fetch(verifyTokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
    cache: 'no-store',
  });

  if (!verifyResponse.ok) {
    await deleteUserCookies();
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  const verifyBody = (await verifyResponse.json()) as VerifyTokenResponse;
  return NextResponse.json({ authenticated: true, user: verifyBody.user }, { status: 200 });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const token = body?.token;

  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Missing token.' }, { status: 400 });
  }

  const verifyTokenUrl = `${config.api.baseUrl}${config.api.endpoints.auth.verifyToken}`;
  const verifyResponse = await fetch(verifyTokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
    cache: 'no-store',
  });

  if (!verifyResponse.ok) {
    await deleteUserCookies();
    return NextResponse.json({ error: 'Invalid authentication token.' }, { status: 401 });
  }

  const verifyBody = (await verifyResponse.json()) as VerifyTokenResponse;
  const user = verifyBody.user as PrivateProfile;
  const response = NextResponse.json({ error: null, user });

  // don't use CookieService setCookie() here,
  // since you are setting cookie on the response, not the store
  response.cookies.set(CookieType.ACCESS_TOKEN, token, authCookieOptions);
  response.cookies.set(CookieType.USER, JSON.stringify(user), authCookieOptions);

  return response;
}
