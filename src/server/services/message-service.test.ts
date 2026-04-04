import { beforeEach, describe, expect, it, vi } from 'vitest';

const { create, listByRelationship } = vi.hoisted(() => ({
  create: vi.fn(),
  listByRelationship: vi.fn(),
}));

vi.mock('@/server/repositories/message-repository', () => ({
  messageRepository: {
    create,
    listByRelationship,
  },
}));

import { messageService } from './message-service';

describe('messageService', () => {
  beforeEach(() => {
    create.mockReset();
    listByRelationship.mockReset();
  });

  it('creates a trimmed relationship message', async () => {
    create.mockResolvedValue({
      id: 'message-1',
      content: 'Looking at the same moon tonight.',
    });

    const result = await messageService.createMessage({
      authorId: 'user-1',
      content: '  Looking at the same moon tonight.  ',
      relationshipId: 'relationship-1',
    });

    expect(result.ok).toBe(true);
    expect(create).toHaveBeenCalledWith({
      authorId: 'user-1',
      content: 'Looking at the same moon tonight.',
      relationshipId: 'relationship-1',
    });
  });

  it('rejects an empty message before trying to persist it', async () => {
    const result = await messageService.createMessage({
      authorId: 'user-1',
      content: '   ',
      relationshipId: 'relationship-1',
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Message content is required.');
    expect(create).not.toHaveBeenCalled();
  });
});
