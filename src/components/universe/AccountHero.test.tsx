import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { AccountHero } from './AccountHero';

const heroModel = {
  eyebrow: 'Profile',
  displayName: 'Member One',
  email: 'member.one@example.com',
  identityLine: 'Identity line',
  avatarLabel: 'MO',
  summaryLabel: 'Account Status',
  summaryValue: 'Active Account',
  relationshipCountLabel: 'Associated Relationships',
  relationshipCountValue: '2 shared universes',
};

describe('AccountHero', () => {
  it('shows account identity in display mode by default', () => {
    render(<AccountHero hero={heroModel} />);

    expect(screen.getByRole('heading', { name: 'Member One' })).toBeInTheDocument();
    expect(screen.getByText('member.one@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit Profile' })).toBeInTheDocument();
  });

  it('switches into inline edit mode', async () => {
    const user = userEvent.setup();

    render(<AccountHero hero={heroModel} />);
    await user.click(screen.getByRole('button', { name: 'Edit Profile' }));

    expect(screen.getByLabelText('Display Name')).toHaveValue('Member One');
    expect(screen.getByLabelText('Email')).toHaveValue('member.one@example.com');
    expect(screen.getByLabelText('Profile')).toHaveValue('Identity line');
    expect(screen.getByRole('button', { name: 'Save Profile' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('resets unsaved edits when cancel is pressed', async () => {
    const user = userEvent.setup();

    render(<AccountHero hero={heroModel} />);
    await user.click(screen.getByRole('button', { name: 'Edit Profile' }));
    await user.clear(screen.getByLabelText('Display Name'));
    await user.type(screen.getByLabelText('Display Name'), 'Changed Name');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await user.click(screen.getByRole('button', { name: 'Edit Profile' }));

    expect(screen.getByLabelText('Display Name')).toHaveValue('Member One');
  });

  it('commits local edits when save is pressed', async () => {
    const user = userEvent.setup();

    render(<AccountHero hero={heroModel} />);
    await user.click(screen.getByRole('button', { name: 'Edit Profile' }));
    await user.clear(screen.getByLabelText('Display Name'));
    await user.type(screen.getByLabelText('Display Name'), 'Changed Name');
    await user.click(screen.getByRole('button', { name: 'Save Profile' }));

    expect(screen.getByRole('heading', { name: 'Changed Name' })).toBeInTheDocument();
    expect(screen.getByText('CN')).toBeInTheDocument();
  });

  it('resyncs local state when hero props change', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<AccountHero hero={heroModel} />);

    await user.click(screen.getByRole('button', { name: 'Edit Profile' }));

    rerender(
      <AccountHero
        hero={{
          ...heroModel,
          displayName: 'Updated Name',
          email: 'updated@example.com',
          identityLine: 'Updated line',
        }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Edit Profile' }));

    expect(screen.getByLabelText('Display Name')).toHaveValue('Updated Name');
    expect(screen.getByLabelText('Email')).toHaveValue('updated@example.com');
    expect(screen.getByLabelText('Profile')).toHaveValue('Updated line');
  });
});
