import type { RelationshipSummary, SessionUserSummary } from '@/types/domain';
import type { UniversePageViewModel } from '@/types/universe';

interface BuildUniverseViewModelArgs {
  relationship: RelationshipSummary;
  latestEvent?: {
    memoryDate: string;
    title: string;
  } | null;
  latestMessage?: {
    authorName: string;
    content: string;
  } | null;
  latestPhoto?: {
    memoryDate?: string | null;
    title: string;
  } | null;
  sessionUser: SessionUserSummary | null;
}

export function buildUniverseViewModel({
  relationship,
  latestEvent,
  latestMessage,
  latestPhoto,
  sessionUser,
}: BuildUniverseViewModelArgs): UniversePageViewModel {
  const isPending = relationship.status === 'pending';
  const isFrozen = relationship.status === 'frozen';
  const memberSummary =
    relationship.members.map((member) => member.displayName).join(' · ') ||
    sessionUser?.name ||
    'Shared space';
  const moduleGallery: UniversePageViewModel['moduleGallery'] = [
    {
      href: '/planet',
      label: 'Memory Planet',
      description: 'Structured memory events for moments you want to keep readable.',
      visualName: 'planet',
    },
    {
      href: '/milky-way',
      label: 'Memory Milky Way',
      description: 'A visual time-path for photos and archived memory fragments.',
      visualName: 'milky-way',
    },
    {
      href: '/constellation',
      label: 'Memory Constellation',
      description: 'A quiet message wall for small notes that still matter later.',
      visualName: 'constellation',
    },
  ] as const;
  const recentPreview: UniversePageViewModel['recentPreview'] = [
    {
      label: 'Latest Event',
      title: latestEvent?.title ?? 'No event recorded yet',
      description: latestEvent
        ? `Saved for ${latestEvent.memoryDate}. Open Memory Planet to revisit or expand it.`
        : 'Shared events will surface here once your first memory is saved.',
    },
    {
      label: 'Latest Photo Moment',
      title: latestPhoto?.title ?? 'No archived photo yet',
      description: latestPhoto?.memoryDate
        ? `Archived into the timeline on ${latestPhoto.memoryDate}.`
        : 'Archived photo moments will appear here once the first upload is confirmed.',
    },
    {
      label: 'Latest Message',
      title: latestMessage?.authorName ?? 'No message yet',
      description: latestMessage?.content ?? 'The most recent short note will appear here once one is written.',
    },
  ] as const;

  return {
    hero: {
      eyebrow: 'Memory Universe',
      title: relationship.title,
      description: isPending
        ? 'Your shared universe is taking shape. Finish the relationship setup and step into your first memory space.'
        : isFrozen
          ? 'This shared universe is preserved as an archive. Existing memories stay visible while new collaboration is paused.'
          : 'A private cosmic archive for the memories you build together and return to over time.',
      statusLabel: isPending ? 'Setup In Progress' : isFrozen ? 'Frozen Archive' : 'Active Universe',
      memberSummary,
    },
    moduleGallery,
    recentPreview,
    archiveNote: {
      title: 'Relationship Archive',
      body: isPending
        ? 'This shared space is still pending. The archive will fully open after the relationship invite is accepted.'
        : isFrozen
          ? 'This relationship archive is frozen. Existing memories remain visible and preserved.'
          : 'This universe remains private by default and keeps shared history readable across every module.',
    },
  };
}
