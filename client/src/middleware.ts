import { NextResponse, NextRequest } from 'next/server';
// import { CookieType } from './lib/types/enums';

export function middleware(request: NextRequest) {
  // don't block any paths
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
  matcher: '/:path*',
};
