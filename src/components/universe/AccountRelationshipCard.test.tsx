import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { AccountRelationshipCard } from './AccountRelationshipCard';

const relationship = {
  id: 'relationship-1',
  title: 'J & M Universe',
  memberSummary: 'Member One · Member Two',
  statusLabel: 'Active Universe',
  emotionalNote: 'A shared archive for moments worth returning to slowly.',
  href: '/universe',
  editLabel: 'Edit Relationship',
  enterLabel: 'Enter Universe',
};

describe('AccountRelationshipCard', () => {
  it('resets unsaved edits when cancel is pressed', async () => {
    const user = userEvent.setup();

    render(<AccountRelationshipCard item={relationship} />);

    await user.click(screen.getByRole('button', { name: 'Edit Relationship' }));
    await user.clear(screen.getByLabelText('Relationship Title'));
    await user.type(screen.getByLabelText('Relationship Title'), 'Changed Title');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await user.click(screen.getByRole('button', { name: 'Edit Relationship' }));

    expect(screen.getByLabelText('Relationship Title')).toHaveValue('J & M Universe');
  });

  it('commits local edits when save is pressed', async () => {
    const user = userEvent.setup();

    render(<AccountRelationshipCard item={relationship} />);

    await user.click(screen.getByRole('button', { name: 'Edit Relationship' }));
    await user.clear(screen.getByLabelText('Relationship Title'));
    await user.type(screen.getByLabelText('Relationship Title'), 'Changed Title');
    await user.click(screen.getByRole('button', { name: 'Save Relationship' }));

    expect(screen.getByRole('heading', { name: 'Changed Title' })).toBeInTheDocument();
  });

  it('resyncs local state when relationship props change', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<AccountRelationshipCard item={relationship} />);

    await user.click(screen.getByRole('button', { name: 'Edit Relationship' }));

    rerender(
      <AccountRelationshipCard
        item={{
          ...relationship,
          title: 'Updated Universe',
          emotionalNote: 'Updated note',
        }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Edit Relationship' }));

    expect(screen.getByLabelText('Relationship Title')).toHaveValue('Updated Universe');
    expect(screen.getByLabelText('Emotional Note')).toHaveValue('Updated note');
  });
});
