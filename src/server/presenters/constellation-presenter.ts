import { presentMockMessages } from '@/server/presenters/message-presenter';
import type {
  ConstellationMessageCardViewModel,
  ConstellationPageViewModel,
} from '@/types/constellation';
import type { MessageSummary } from '@/types/domain';

interface BuildConstellationViewModelArgs {
  messages?: MessageSummary[];
}

function formatCreatedAtLabel(createdAt: string) {
  return new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function toMessageCard(message: MessageSummary): ConstellationMessageCardViewModel {
  return {
    id: message.id,
    authorName: message.authorName,
    content: message.content,
    createdAtLabel: formatCreatedAtLabel(message.createdAt),
  };
}

export function buildConstellationViewModel(
  args: BuildConstellationViewModelArgs = {}
): ConstellationPageViewModel {
  const messages = (args.messages ?? presentMockMessages())
    .slice()
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .map(toMessageCard);

  return {
    hero: {
      eyebrow: 'Constellation',
      title: 'Memory Constellation',
      lead: 'Small notes stay brighter when they have a shared sky to return to.',
      description:
        'A quiet wall for greetings, affection, and short daily feelings that belong in the archive, not inside an event record.',
    },
    messages,
    emptyState: {
      title: 'No stars yet',
      description: 'Write the first note and let this shared sky begin with something small.',
    },
    floatingAction: {
      ariaLabel: 'Write a new constellation message',
    },
    composer: {
      title: 'Write Into Your Shared Sky',
      helperText: 'Leave one short note that belongs with the rest of your shared constellation.',
      placeholder: 'Write a short message...',
      submitLabel: 'Add Note',
      cancelLabel: 'Cancel',
      maxLength: 220,
    },
  };
}
