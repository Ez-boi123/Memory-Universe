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
        <Link
          aria-label="Profile"
          className="app-top-nav-profile"
          href="/settings/account"
        >
          <svg
            aria-hidden="true"
            className="app-top-nav-profile-icon"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.86 0-7 2.24-7 5v1h14v-1c0-2.76-3.14-5-7-5Z"
              fill="currentColor"
            />
          </svg>
        </Link>
      </div>
    </header>
  );
}
