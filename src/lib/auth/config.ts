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
    strategy: 'database',
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
    async session({ session, user }) {
      const membership = await db.relationshipMember.findFirst({
        where: {
          userId: user.id,
        },
        include: {
          relationship: true,
        },
        orderBy: {
          joinedAt: 'asc',
        },
      });

      return {
        ...buildPlaceholderSession(session),
        user: {
          ...session.user,
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          relationshipId: membership?.relationshipId ?? null,
          relationshipStatus: membership?.relationship.status ?? null,
          authState: 'authenticated' as const,
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
