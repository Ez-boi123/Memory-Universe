import { describe, expect, it } from 'vitest';

import { buildUniverseViewModel } from './universe-presenter';

describe('buildUniverseViewModel', () => {
  it('returns the hero, module gallery, recent preview, and archive note content', () => {
    const viewModel = buildUniverseViewModel({
      relationship: {
        id: 'relationship-1',
        status: 'active',
        title: 'J & M Universe',
        members: [
          { id: 'user-1', displayName: 'J', email: 'j@example.com' },
          { id: 'user-2', displayName: 'M', email: 'm@example.com' },
        ],
      },
      sessionUser: {
        id: 'user-1',
        name: 'J',
        email: 'j@example.com',
        relationshipStatus: 'active',
        authState: 'authenticated',
      },
    });

    expect(viewModel.hero.title).toBe('J & M Universe');
    expect(viewModel.moduleGallery).toHaveLength(3);
    expect(viewModel.recentPreview).toHaveLength(3);
    expect(viewModel.archiveNote.title).toBe('Relationship Archive');
  });
});
