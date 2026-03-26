import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Memory Universe',
  description: 'Private relationship-centered memory space scaffold',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
