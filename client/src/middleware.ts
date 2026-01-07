import { NextResponse, NextRequest } from 'next/server';
import { CookieType } from './lib/types/enums';

export function middleware(request: NextRequest) {
  // don't block any paths
  const userCookie = request.cookies.get(CookieType.USER);

  // Send the user to the login page if they don't have a valid cookie
  if (!userCookie) {
    return NextResponse.redirect(new URL('/api/logout', request.url));
  }

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
  matcher: ['/', '/profile', '/apply/:step'],
};
