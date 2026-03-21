import { NextRequest, NextResponse } from 'next/server';
import { CookieType } from '@/lib/types/enums';

const toBearer = (value: string) => (value.startsWith('Bearer ') ? value : `Bearer ${value}`);

// Call backend API to update user's FetchAI handle
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const apiBase = process.env.ACM_API_URL || process.env.NEXT_PUBLIC_ACM_API_URL;
    if (!apiBase) {
      return NextResponse.json({ error: { message: 'ACM_API_URL is not set' } }, { status: 500 });
    }

    const incomingAuth = (req.headers.get('authorization') || '').trim();
    const cookieHeader = req.headers.get('cookie') || '';

    // same cookie key pattern used elsewhere in your app
    const accessToken = req.cookies.get(CookieType.ACCESS_TOKEN)?.value || '';

    const authorization = incomingAuth
      ? toBearer(incomingAuth.replace(/^Bearer\s+/i, '').trim())
      : accessToken
        ? toBearer(accessToken.replace(/^Bearer\s+/i, '').trim())
        : '';

    const upstream = await fetch(`${apiBase.replace(/\/+$/, '')}/user/fetch-ai-handle`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(authorization ? { Authorization: authorization } : {}),
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('content-type') || 'application/json',
      },
    });
  } catch {
    return NextResponse.json({ error: { message: 'Request failed' } }, { status: 500 });
  }
}
