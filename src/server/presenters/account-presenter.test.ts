import { describe, expect, it } from 'vitest';

import { buildAccountPageViewModel } from './account-presenter';

describe('buildAccountPageViewModel', () => {
  it('builds the desktop account page model with an empty relationship state by default', () => {
    const model = buildAccountPageViewModel();

    expect(model.hero.displayName).toBe('Member One');
    expect(model.relationships.items).toHaveLength(0);
    expect(model.hero.relationshipCountValue).toBe('0 shared universes');
    expect(model.relationCode.code).toBe('MU-USER-2048');
    expect(model.security.actionLabel).toBe('Change Password');
    expect(model.dangerZone.signOutLabel).toBe('Sign Out');
  });

  it('builds an empty relationships state when no relationships are connected', () => {
    const model = buildAccountPageViewModel({ relationships: [] });

    expect(model.relationships.items).toEqual([]);
    expect(model.relationships.emptyTitle).toContain('No relationships');
    expect(model.hero.relationshipCountValue).toBe('0 shared universes');
  });

  it('omits auxiliary placeholder messaging for bind, security, and delete actions', () => {
    const model = buildAccountPageViewModel();

    expect(model.relationCode.bindHint).toBe('');
    expect(model.security.helperText).toBe('');
    expect(model.dangerZone.deleteHint).toBe('');
  });

  it('uses session and relationship inputs when available', () => {
    const model = buildAccountPageViewModel({
      relationship: {
        id: 'relationship-real',
        status: 'active',
        title: 'Real Universe',
        members: [
          { id: 'user-1', displayName: 'Alice', email: 'alice@example.com' },
          { id: 'user-2', displayName: 'Bob', email: 'bob@example.com' },
        ],
      },
      sessionUser: {
        id: 'user-1',
        name: 'Alice Example',
        email: 'alice@example.com',
        relationshipStatus: 'active',
        authState: 'authenticated',
      },
    });

    expect(model.hero.displayName).toBe('Alice Example');
    expect(model.hero.email).toBe('alice@example.com');
    expect(model.hero.avatarLabel).toBe('AE');
    expect(model.hero.summaryValue).toBe('Authenticated Account');
    expect(model.hero.relationshipCountValue).toBe('1 shared universe');
    expect(model.relationships.items[0]?.title).toBe('Real Universe');
    expect(model.relationCode.code).toBe('MU-U-USER1');
  });
});
