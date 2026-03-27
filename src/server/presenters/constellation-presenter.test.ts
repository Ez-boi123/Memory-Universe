import { describe, expect, it } from 'vitest';

import { buildConstellationViewModel } from './constellation-presenter';

describe('buildConstellationViewModel', () => {
  it('builds newest-first message cards and shared-sky hero copy', () => {
    const model = buildConstellationViewModel();

    expect(model.hero.title).toBe('Memory Constellation');
    expect(model.messages.map((message) => message.id)).toEqual([
      'message-3',
      'message-2',
      'message-1',
    ]);
    expect(model.floatingAction.ariaLabel).toBe('Write a new constellation message');
    expect(model.composer.maxLength).toBe(220);
  });

  it('returns the empty-state copy when no messages are available', () => {
    const model = buildConstellationViewModel({ messages: [] });

    expect(model.messages).toEqual([]);
    expect(model.emptyState.title).toBe('No stars yet');
    expect(model.emptyState.description).toContain('first note');
  });
});
