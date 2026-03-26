import type { ReactNode } from 'react';

import { getSessionUser } from '@/lib/auth/session';
import { AppNavigation } from '@/components/universe/AppNavigation';

interface AppShellProps {
  children: ReactNode;
}

export async function AppShell({ children }: AppShellProps) {
  const { user } = await getSessionUser();

  return (
    <div className="page-shell">
      <section className="page-card app-shell-header">
        <p className="page-eyebrow">Session</p>
        <h1 className="app-shell-title">Memory Universe</h1>
        <p className="page-description">
          Signed in as {user?.name ?? user?.email ?? 'Unknown User'}.
          {user?.relationshipStatus
            ? ` Relationship status: ${user.relationshipStatus}.`
            : ' No relationship space has been connected yet.'}
        </p>
      </section>
      <div className="two-column">
        <AppNavigation />
        <div>{children}</div>
      </div>
    </div>
  );
}
