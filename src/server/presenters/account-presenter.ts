import type { AccountPageViewModel } from '@/types/account';
import type { RelationshipSummary, SessionUserSummary } from '@/types/domain';

export interface BuildAccountPageViewModelArgs {
  relationships?: AccountPageViewModel['relationships']['items'];
  relationship?: RelationshipSummary | null;
  sessionUser?: SessionUserSummary | null;
}

export function buildAccountPageViewModel(
  args: BuildAccountPageViewModelArgs = {},
): AccountPageViewModel {
  const relationshipItems =
    args.relationships ?? (args.relationship ? [buildRelationshipCard(args.relationship)] : []);
  const displayName = args.sessionUser?.name?.trim() || 'Member One';
  const email = args.sessionUser?.email?.trim() || 'member.one@example.com';
  const relationshipCountValue = `${relationshipItems.length} ${
    relationshipItems.length === 1 ? 'shared universe' : 'shared universes'
  }`;

  return {
    hero: {
      eyebrow: 'Profile',
      displayName,
      email,
      identityLine: 'A personal archive keeper shaping shared universes with care.',
      avatarLabel: buildAvatarLabel(displayName),
      summaryLabel: 'Account Status',
      summaryValue:
        args.sessionUser?.authState === 'authenticated' ? 'Authenticated Account' : 'Active Account',
      relationshipCountLabel: 'Associated Relationships',
      relationshipCountValue,
    },
    relationships: {
      title: 'Associated Relationships',
      description: '',
      emptyTitle: 'No relationships connected yet',
      emptyBody: 'Use your relation code to bind this account to a shared memory universe.',
      items: relationshipItems,
    },
    relationCode: {
      title: 'Relation Code',
      description: 'Use this code to bind a relationship to your account.',
      code: buildRelationCode(args.relationship?.id),
      copyLabel: 'Copy Code',
      bindLabel: 'Bind',
      bindHint: '',
    },
    security: {
      title: 'Security',
      description: '',
      actionLabel: 'Change Password',
      helperText: '',
    },
    dangerZone: {
      title: 'Danger Zone',
      description: '',
      signOutLabel: 'Sign Out',
      deleteLabel: 'Delete Account',
      deleteHint: '',
    },
  };
}

function buildAvatarLabel(displayName: string) {
  const parts = displayName
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return 'MU';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

function buildRelationshipCard(
  relationship: RelationshipSummary
): AccountPageViewModel['relationships']['items'][number] {
  return {
    id: relationship.id,
    title: relationship.title,
    memberSummary: relationship.members.map((member) => member.displayName).join(' · '),
    statusLabel:
      relationship.status === 'pending'
        ? 'Setup In Progress'
        : relationship.status === 'frozen'
          ? 'Frozen Archive'
          : 'Active Universe',
    emotionalNote:
      relationship.status === 'pending'
        ? 'A shared archive still waiting for its final shape.'
        : relationship.status === 'frozen'
          ? 'A preserved space whose memories remain visible and still.'
          : 'A shared archive for moments worth returning to slowly.',
    href: '/universe',
    editLabel: 'Edit Relationship',
    enterLabel: 'Enter Universe',
  };
}

function buildRelationCode(relationshipId?: string | null) {
  if (!relationshipId) {
    return 'MU-REL-2048';
  }

  return `MU-${relationshipId.replace(/[^a-z0-9]/gi, '').slice(0, 8).toUpperCase()}`;
}
