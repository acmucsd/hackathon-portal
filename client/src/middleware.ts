import { NextResponse, NextRequest } from 'next/server';
import { CookieType } from './lib/types/enums';

const PUBLIC_PATHS = [
  '/login',
  '/closed',
  '/check-email',
  '/check-reset-email',
  '/forgot-password',
  '/register',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(CookieType.ACCESS_TOKEN);
  const userCookie = request.cookies.get(CookieType.USER);

  // Send the user to dashboard if already logged in
  if (PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(`${path}/`))) {
    if (accessToken && userCookie) return NextResponse.redirect(new URL('/', request.url));
    return NextResponse.next();
  }

  // Send the user to login if required auth cookies are missing
  if (!accessToken || !userCookie) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete(CookieType.ACCESS_TOKEN);
    response.cookies.delete(CookieType.USER);
    return response;
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)'],
};
