import { validateMessageContent } from '@/lib/validation/message';
import { messageRepository } from '@/server/repositories/message-repository';

export const messageService = {
  listMessages: async (relationshipId: string) => ({
    result: await messageRepository.listByRelationship(relationshipId),
  }),
  createMessage: async ({
    authorId,
    content,
    relationshipId,
  }: {
    authorId: string;
    content: string;
    relationshipId: string;
  }) => {
    const normalizedContent = content.trim();
    const validation = validateMessageContent(normalizedContent);

    if (!validation.success) {
      return {
        errors: validation.errors,
        ok: false as const,
      };
    }

    const message = await messageRepository.create({
      authorId,
      content: normalizedContent,
      relationshipId,
    });

    return {
      message,
      ok: true as const,
    };
  },
};
