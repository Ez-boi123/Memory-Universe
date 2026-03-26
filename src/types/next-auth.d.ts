import type { DefaultSession } from 'next-auth';

import type { RelationshipStatus } from '@/types/domain';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      relationshipId?: string | null;
      relationshipStatus?: RelationshipStatus | null;
      authState?: 'placeholder' | 'authenticated';
    };
  }

  interface User {
    id: string;
    relationshipId?: string | null;
    relationshipStatus?: RelationshipStatus | null;
    authState?: 'placeholder' | 'authenticated';
  }
}
