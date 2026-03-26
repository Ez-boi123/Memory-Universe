import { describe, expect, it } from 'vitest';

import { buildUniverseViewModel } from './universe-presenter';

const relationship = {
  id: 'relationship-1',
  status: 'active' as const,
  title: 'J & M Universe',
  members: [
    { id: 'user-1', displayName: 'J', email: 'j@example.com' },
    { id: 'user-2', displayName: 'M', email: 'm@example.com' },
  ],
};

describe('buildUniverseViewModel', () => {
  it('builds the active-state universe homepage model', () => {
    const model = buildUniverseViewModel({
      relationship,
      sessionUser: {
        id: 'user-1',
        name: 'J',
        email: 'j@example.com',
        relationshipStatus: 'active',
        authState: 'authenticated',
      },
    });

    expect(model.hero.title).toBe('J & M Universe');
    expect(model.hero.statusLabel).toBe('Active Universe');
    expect(model.moduleGallery.map((item) => item.href)).toEqual([
      '/planet',
      '/milky-way',
      '/constellation',
    ]);
    expect(model.recentPreview.map((item) => item.label)).toEqual([
      'Latest Event',
      'Latest Photo Moment',
      'Latest Message',
    ]);
    expect(model.archiveNote.title).toBe('Relationship Archive');
  });

  it('changes copy for pending relationships', () => {
    const model = buildUniverseViewModel({
      relationship: {
        ...relationship,
        status: 'pending',
      },
      sessionUser: {
        id: 'user-1',
        name: 'J',
        email: 'j@example.com',
        relationshipStatus: 'pending',
        authState: 'authenticated',
      },
    });

    expect(model.hero.statusLabel).toBe('Setup In Progress');
    expect(model.archiveNote.body).toContain('invite');
  });

  it('uses frozen-state copy for preserved relationships', () => {
    const model = buildUniverseViewModel({
      relationship: {
        ...relationship,
        status: 'frozen',
      },
      sessionUser: {
        id: 'user-1',
        name: 'J',
        email: 'j@example.com',
        relationshipStatus: 'frozen',
        authState: 'authenticated',
      },
    });

    expect(model.hero.statusLabel).toBe('Frozen Archive');
    expect(model.archiveNote.body).toContain('frozen');
  });

  it('falls back to the session user name when relationship members are empty', () => {
    const model = buildUniverseViewModel({
      relationship: {
        ...relationship,
        members: [],
      },
      sessionUser: {
        id: 'user-1',
        name: 'J',
        email: 'j@example.com',
        relationshipStatus: 'active',
        authState: 'authenticated',
      },
    });

    expect(model.hero.memberSummary).toBe('J');
  });

  it('falls back to shared space when no member names are available', () => {
    const model = buildUniverseViewModel({
      relationship: {
        ...relationship,
        members: [],
      },
      sessionUser: {
        id: 'user-1',
        email: 'j@example.com',
        relationshipStatus: 'active',
        authState: 'authenticated',
      },
    });

    expect(model.hero.memberSummary).toBe('Shared space');
  });
});
