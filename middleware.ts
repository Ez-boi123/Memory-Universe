import { NextResponse } from 'next/server';

import { auth } from '@/auth';

const protectedPrefixes = [
  '/universe',
  '/planet',
  '/milky-way',
  '/upload-memory',
  '/constellation',
  '/search',
  '/settings',
];

const authPrefixes = ['/sign-in', '/sign-up'];

export default auth((request) => {
  const isSignedIn = Boolean(request.auth?.user);
  const { nextUrl } = request;
  const isProtectedRoute = protectedPrefixes.some((path) => nextUrl.pathname.startsWith(path));
  const isAuthRoute = authPrefixes.some((path) => nextUrl.pathname.startsWith(path));

  if (isProtectedRoute && !isSignedIn) {
    const signInUrl = new URL('/sign-in', nextUrl);
    const callbackUrl = `${nextUrl.pathname}${nextUrl.search}`;

    signInUrl.searchParams.set('callbackUrl', callbackUrl);
    signInUrl.searchParams.set(
      'message',
      'Please sign in to continue to your private memory universe.'
    );

    return NextResponse.redirect(signInUrl);
  }

  if (isAuthRoute && isSignedIn) {
    return NextResponse.redirect(new URL('/universe', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/universe/:path*',
    '/planet/:path*',
    '/milky-way/:path*',
    '/upload-memory/:path*',
    '/constellation/:path*',
    '/search/:path*',
    '/settings/:path*',
    '/sign-in',
    '/sign-up',
  ],
};
