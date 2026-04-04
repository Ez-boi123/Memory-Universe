import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { AccountPageViewModel } from '@/types/account';

import { AccountPage } from './AccountPage';

vi.mock('@/components/auth/SignOutForm', () => ({
  SignOutForm: function SignOutForm({ label = 'Sign Out' }: { label?: string }) {
    return <button type="button">{label}</button>;
  },
}));

const model: AccountPageViewModel = {
  hero: {
    eyebrow: 'Profile',
    displayName: 'Member One',
    email: 'member.one@example.com',
    identityLine: 'A personal archive keeper shaping shared universes with care.',
    avatarLabel: 'MO',
    summaryLabel: 'Account Status',
    summaryValue: 'Active Account',
    relationshipCountLabel: 'Associated Relationships',
    relationshipCountValue: '2 shared universes',
  },
  relationships: {
    title: 'Associated Relationships',
    description: '',
    emptyTitle: 'No relationships connected yet',
    emptyBody: 'Use your personal relation code to connect this account to a shared memory universe.',
    items: [
      {
        id: 'relationship-1',
        title: 'J & M Universe',
        memberSummary: 'Member One · Member Two',
        statusLabel: 'Active Universe',
        emotionalNote: 'A shared archive for moments worth returning to slowly.',
        href: '/universe',
        editLabel: 'Edit Relationship',
        enterLabel: 'Enter Universe',
      },
    ],
  },
  relationCode: {
    title: 'Relation Code',
    description: 'This is your personal relation code. Share it when another flow needs to identify your account.',
    code: 'MU-USER-2048',
    copyLabel: 'Copy Code',
    bindLabel: 'Bind',
    bindHint: '',
  },
  security: {
    title: 'Security',
    description: '',
    actionLabel: 'Change Password',
    helperText: '',
  },
  dangerZone: {
    title: 'Danger Zone',
    description: '',
    signOutLabel: 'Sign Out',
    deleteLabel: 'Delete Account',
    deleteHint: '',
  },
};

describe('AccountPage', () => {
  it('renders the account page sections in the correct order', () => {
    const { container } = render(<AccountPage model={model} />);
    const pageChildren = Array.from(
      container.querySelector('.account-page')?.children ?? []
    ).map((element) => element.className);

    expect(pageChildren).toEqual([
      'account-hero',
      'account-section account-section--relationships',
      'account-section account-section--relation-code',
      'account-section account-section--security',
      'account-danger-zone account-danger-zone--decorated',
    ]);
    expect(screen.getByRole('heading', { name: 'Member One' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Associated Relationships' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Relation Code' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Security' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Danger Zone' })).not.toBeInTheDocument();
    expect(container.querySelector('.account-page')).not.toBeNull();
    expect(container.querySelector('.account-hero')).not.toBeNull();
    expect(container.querySelector('.account-relationship-list')).not.toBeNull();
    expect(container.querySelector('.account-danger-zone')).not.toBeNull();
  });

  it('opens a delete confirmation dialog and closes it on cancel', () => {
    const { container } = render(<AccountPage model={model} />);

    fireEvent.click(screen.getByRole('button', { name: 'Delete Account' }));

    expect(screen.getByRole('dialog', { name: 'Confirm Account Deletion' })).toBeInTheDocument();
    expect(
      screen.getByText('Deleting your account will permanently remove all records and they cannot be recovered.')
    ).toBeInTheDocument();
    expect(container.querySelector('.account-danger-zone-dialog-backdrop')).toBeNull();
    expect(document.body.querySelector('.account-danger-zone-dialog-backdrop')).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('dialog', { name: 'Confirm Account Deletion' })).not.toBeInTheDocument();
  });

  it('opens a password dialog and validates matching passwords', () => {
    render(<AccountPage model={model} />);

    fireEvent.click(screen.getByRole('button', { name: 'Change Password' }));

    expect(screen.getByRole('dialog', { name: 'Update Password' })).toBeInTheDocument();
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'galaxy-echo' },
    });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), {
      target: { value: 'galaxy-mismatch' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Update Password' }));

    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
  });
});
