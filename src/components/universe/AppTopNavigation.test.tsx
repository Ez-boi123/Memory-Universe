import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { vi } from 'vitest';

import { AppTopNavigation } from './AppTopNavigation';

const { usePathname } = vi.hoisted(() => ({
  usePathname: vi.fn(() => '/universe'),
}));

vi.mock('next/navigation', () => ({
  usePathname,
}));

describe('AppTopNavigation', () => {
  it('renders the planned three-region top navigation', () => {
    usePathname.mockReturnValue('/universe');
    render(<AppTopNavigation />);

    expect(screen.getByRole('link', { name: 'Memory Universe' })).toHaveAttribute('href', '/universe');
    expect(screen.getByRole('link', { name: 'Universe' })).toHaveAttribute('href', '/universe');
    expect(screen.getByRole('link', { name: 'Planet' })).toHaveAttribute('href', '/planet');
    expect(screen.getByRole('link', { name: 'Milky Way' })).toHaveAttribute('href', '/milky-way');
    expect(screen.getByRole('link', { name: 'Constellation' })).toHaveAttribute('href', '/constellation');
    expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute('href', '/settings/account');
  });

  it('shows the current user display name next to the profile icon', () => {
    usePathname.mockReturnValue('/universe');
    render(<AppTopNavigation displayName="Alice Example" />);

    expect(screen.getByText('Alice Example')).toBeInTheDocument();
  });

  it('marks the current page link as active', () => {
    usePathname.mockReturnValue('/milky-way');
    render(<AppTopNavigation />);

    expect(screen.getByRole('link', { name: 'Milky Way' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Milky Way' })).toHaveClass('is-current');
    expect(screen.getByRole('link', { name: 'Planet' })).not.toHaveAttribute('aria-current');
  });
});
