import Link from 'next/link';

import { SignOutForm } from '@/components/auth/SignOutForm';
import type { AppNavItem } from '@/types/navigation';

const navItems: AppNavItem[] = [
  {
    href: '/universe',
    label: 'Universe',
    description: 'Relationship home and overview',
  },
  {
    href: '/planet',
    label: 'Planet',
    description: 'Memory events',
  },
  {
    href: '/milky-way',
    label: 'Milky Way',
    description: 'Photo timeline',
  },
  {
    href: '/constellation',
    label: 'Constellation',
    description: 'Message board',
  },
  {
    href: '/search',
    label: 'Search',
    description: 'Search events and messages',
  },
  {
    href: '/upload-memory',
    label: 'Upload Memory',
    description: 'Pending archive entry',
  },
  {
    href: '/settings/relationship',
    label: 'Relationship Settings',
    description: 'Invite and relationship state',
  },
  {
    href: '/settings/account',
    label: 'Account Settings',
    description: 'Profile and account preferences',
  },
];

export function AppNavigation() {
  return (
    <nav className="page-card">
      <p className="page-eyebrow">Navigation</p>
      <div className="placeholder-grid">
        {navItems.map((item) => (
          <Link key={item.href} className="placeholder-panel" href={item.href}>
            <h3>{item.label}</h3>
            <p>{item.description}</p>
          </Link>
        ))}
      </div>
      <div className="auth-nav-footer">
        <SignOutForm />
      </div>
    </nav>
  );
}
