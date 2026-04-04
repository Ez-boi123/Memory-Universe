import type { DefaultSession } from 'next-auth';
import type { DefaultJWT } from 'next-auth/jwt';

import type { RelationshipStatus } from '@/types/domain';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      relationCode?: string | null;
      relationshipId?: string | null;
      relationshipStatus?: RelationshipStatus | null;
      authState?: 'placeholder' | 'authenticated';
    };
  }

  interface User {
    id: string;
    relationCode?: string | null;
    relationshipId?: string | null;
    relationshipStatus?: RelationshipStatus | null;
    authState?: 'placeholder' | 'authenticated';
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    relationCode?: string | null;
    relationshipId?: string | null;
    relationshipStatus?: RelationshipStatus | null;
    authState?: 'placeholder' | 'authenticated';
  }
}
