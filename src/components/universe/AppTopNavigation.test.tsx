import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AppTopNavigation } from './AppTopNavigation';

describe('AppTopNavigation', () => {
  it('renders the planned three-region top navigation', () => {
    render(<AppTopNavigation />);

    expect(screen.getByRole('link', { name: 'Memory Universe' })).toHaveAttribute('href', '/universe');
    expect(screen.getByRole('link', { name: 'Universe' })).toHaveAttribute('href', '/universe');
    expect(screen.getByRole('link', { name: 'Planet' })).toHaveAttribute('href', '/planet');
    expect(screen.getByRole('link', { name: 'Milky Way' })).toHaveAttribute('href', '/milky-way');
    expect(screen.getByRole('link', { name: 'Constellation' })).toHaveAttribute('href', '/constellation');
    expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute('href', '/settings/account');
  });

  it('shows the current user display name next to the profile icon', () => {
    render(<AppTopNavigation displayName="Alice Example" />);

    expect(screen.getByText('Alice Example')).toBeInTheDocument();
  });
});
