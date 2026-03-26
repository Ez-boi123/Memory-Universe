export { auth as middleware } from '@/auth';

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
