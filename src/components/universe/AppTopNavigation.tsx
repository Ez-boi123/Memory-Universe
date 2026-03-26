import React from 'react';
import Link from 'next/link';

const topNavItems = [
  { href: '/universe', label: 'Universe' },
  { href: '/planet', label: 'Planet' },
  { href: '/milky-way', label: 'Milky Way' },
  { href: '/constellation', label: 'Constellation' },
];

export function AppTopNavigation() {
  return (
    <header className="app-top-nav">
      <div className="app-top-nav-inner">
        <Link className="app-top-nav-brand" href="/universe">
          Memory Universe
        </Link>
        <nav className="app-top-nav-links" aria-label="Primary">
          {topNavItems.map((item) => (
            <Link key={item.href} className="app-top-nav-link" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="app-top-nav-profile" href="/settings/account">
          Profile
        </Link>
      </div>
    </header>
  );
}
