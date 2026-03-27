import { describe, expect, it } from 'vitest';

import { buildConstellationViewModel } from './constellation-presenter';

describe('buildConstellationViewModel', () => {
  it('builds newest-first message cards and shared-sky hero copy', () => {
    const model = buildConstellationViewModel();

    expect(model.hero.eyebrow).toBe('Constellation');
    expect(model.hero.title).toBe('Memory Constellation');
    expect(model.hero.lead).toBe(
      'Small notes stay brighter when they have a shared sky to return to.'
    );
    expect(model.hero.description).toBe(
      'A quiet wall for greetings, affection, and short daily feelings that belong in the archive, not inside an event record.'
    );
    expect(model.messages.map((message) => message.id)).toEqual([
      'message-3',
      'message-2',
      'message-1',
    ]);
    expect(model.messages[0]).toMatchObject({
      id: 'message-3',
      authorName: 'Member Two',
      content: 'Leaving a small note here so this ordinary day stays glowing.',
      createdAtLabel: 'Mar 26, 2026',
    });
    expect(model.floatingAction.ariaLabel).toBe('Write a new constellation message');
    expect(model.composer.title).toBe('Write Into Your Shared Sky');
    expect(model.composer.helperText).toBe(
      'Leave one short note that belongs with the rest of your shared constellation.'
    );
    expect(model.composer.placeholder).toBe('Write a short message...');
    expect(model.composer.submitLabel).toBe('Add Note');
    expect(model.composer.cancelLabel).toBe('Cancel');
    expect(model.composer.maxLength).toBe(220);
  });

  it('returns the empty-state copy when no messages are available', () => {
    const model = buildConstellationViewModel({ messages: [] });

    expect(model.messages).toEqual([]);
    expect(model.emptyState.title).toBe('No stars yet');
    expect(model.emptyState.description).toContain('first note');
  });
});
