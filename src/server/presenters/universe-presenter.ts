import type { RelationshipSummary, SessionUserSummary } from '@/types/domain';
import type { UniversePageViewModel } from '@/types/universe';

interface BuildUniverseViewModelArgs {
  relationship: RelationshipSummary;
  sessionUser: SessionUserSummary | null;
}

export function buildUniverseViewModel({
  relationship,
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
      title: 'First Shared Chapter',
      description: 'Placeholder preview for the latest event card until repository reads are connected.',
    },
    {
      label: 'Latest Photo Moment',
      title: 'A Memory Waiting In Time',
      description: 'Placeholder preview for the latest archived photo moment until timeline data is connected.',
    },
    {
      label: 'Latest Message',
      title: 'A Small Note Still Glowing',
      description: 'Placeholder preview for the latest relationship message until message queries are connected.',
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
