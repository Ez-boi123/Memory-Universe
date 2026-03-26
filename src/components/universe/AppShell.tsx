import type { ReactNode } from 'react';

import { AppTopNavigation } from '@/components/universe/AppTopNavigation';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <AppTopNavigation />
      <main className="app-shell-main">{children}</main>
    </div>
  );
}
