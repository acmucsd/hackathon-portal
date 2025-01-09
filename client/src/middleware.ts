import { NextResponse, NextRequest } from 'next/server';
import { CookieType } from './lib/types/enums';

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get(CookieType.USER);
  const tokenCookie = request.cookies.get(CookieType.ACCESS_TOKEN);

  if (!userCookie || !tokenCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/profile'],
};
