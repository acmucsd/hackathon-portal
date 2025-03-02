import { NextResponse, NextRequest } from 'next/server';
import { CookieType } from './lib/types/enums';

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get(CookieType.USER);

  // Send the user to the login page if they don't have a valid cookie
  if (!userCookie) {
    return NextResponse.redirect(new URL('/api/logout', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/profile', '/apply/:step'],
};
