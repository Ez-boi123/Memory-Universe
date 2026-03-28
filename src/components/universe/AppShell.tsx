import type { ReactNode } from 'react';

import { AppTopNavigation } from '@/components/universe/AppTopNavigation';
import { getSessionUser } from '@/lib/auth/session';

interface AppShellProps {
  children: ReactNode;
}

export async function AppShell({ children }: AppShellProps) {
  const { user } = await getSessionUser();

  return (
    <div className="app-shell">
      <AppTopNavigation displayName={user?.name ?? null} />
      <main className="app-shell-main">{children}</main>
    </div>
  );
}
