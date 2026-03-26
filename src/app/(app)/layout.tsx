import type { ReactNode } from 'react';

import { AppShell } from '@/components/universe/AppShell';

export default function ProductLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main>
      <AppShell>{children}</AppShell>
    </main>
  );
}
