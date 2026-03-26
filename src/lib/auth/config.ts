import { PrismaAdapter } from '@auth/prisma-adapter';
import type { NextAuthConfig, Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { db } from '@/lib/db/client';
import { validateAuthInput } from '@/lib/validation/auth';
import { authService } from '@/server/services/auth-service';

function buildPlaceholderSession(session: Session) {
  return {
    ...session,
    user: {
      ...session.user,
      id: session.user?.id ?? 'placeholder-user-id',
      relationshipId: null,
      relationshipStatus: null,
      authState: 'placeholder' as const,
    },
  };
}

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  trustHost: true,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/sign-in',
  },
  providers: [
    Credentials({
      name: 'Email And Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const validation = validateAuthInput({
          email: String(credentials?.email ?? ''),
          password: String(credentials?.password ?? ''),
        });

        if (!validation.success) {
          return null;
        }

        const result = await authService.signIn({
          email: String(credentials?.email ?? ''),
          password: String(credentials?.password ?? ''),
        });

        if (!result.ok) {
          return null;
        }

        const membership = result.user.relationships[0];

        return {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name ?? result.user.displayName,
          image: result.user.image ?? result.user.avatarUrl,
          relationshipId: membership?.relationshipId ?? null,
          relationshipStatus: membership?.relationship.status ?? null,
          authState: 'authenticated' as const,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.relationshipId = user.relationshipId ?? null;
        token.relationshipStatus = user.relationshipStatus ?? null;
        token.authState = user.authState ?? 'authenticated';
      }

      return token;
    },
    async session({ session, token }) {
      const userId = typeof token.sub === 'string' ? token.sub : session.user?.id;

      return {
        ...buildPlaceholderSession(session),
        user: {
          ...session.user,
          id: userId ?? 'placeholder-user-id',
          name: session.user?.name ?? null,
          email: session.user?.email ?? null,
          image: session.user?.image ?? null,
          relationshipId:
            typeof token.relationshipId === 'string' ? token.relationshipId : null,
          relationshipStatus:
            typeof token.relationshipStatus === 'string'
              ? token.relationshipStatus
              : null,
          authState:
            token.authState === 'authenticated' ? 'authenticated' : 'placeholder',
        },
      };
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isSignedIn = Boolean(auth?.user);
      const isProtectedRoute = [
        '/universe',
        '/planet',
        '/milky-way',
        '/upload-memory',
        '/constellation',
        '/search',
        '/settings',
      ].some((path) => nextUrl.pathname.startsWith(path));
      const isAuthRoute = ['/sign-in', '/sign-up'].some((path) =>
        nextUrl.pathname.startsWith(path)
      );

      if (isProtectedRoute) {
        return isSignedIn;
      }

      if (isAuthRoute && isSignedIn) {
        return Response.redirect(new URL('/universe', nextUrl));
      }

      return true;
    },
  },
};
