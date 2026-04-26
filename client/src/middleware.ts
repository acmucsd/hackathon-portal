import { NextResponse, NextRequest } from 'next/server';
import { CookieType } from './lib/types/enums';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get(CookieType.ACCESS_TOKEN);
  const userCookie = request.cookies.get(CookieType.USER);

  // Send the user to login if required auth cookies are missing
  if (!accessToken || !userCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Continue to the requested page
  return NextResponse.next();

  // uncomment the below to redirect most paths to /closed
  // const url = new URL(request.url);
  // const pathname = url.pathname;
  // const allowedPaths = ['/closed', '/_next', '/favicon', '/assets'];

  // if (allowedPaths.some(path => pathname.startsWith(path))) {
  //   return NextResponse.next();
  // }

  // return NextResponse.redirect(new URL('/closed', request.url));
}

export const config = {
  // matcher: '/:path*',  // used for redirecting paths to /closed
  matcher: ['/', '/profile', '/apply/:step', '/schedule', '/resources'],
};
