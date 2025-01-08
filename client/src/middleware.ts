import { NextResponse, NextRequest } from 'next/server';
import { CookieType } from './lib/types/enums';

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get(CookieType.USER);

  if (!userCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/profile', '/apply'],
};
