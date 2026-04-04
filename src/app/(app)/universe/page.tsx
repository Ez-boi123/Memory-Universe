import { UniverseOverview } from '@/components/universe/UniverseOverview';
import { getSessionUser, resolveSessionRelationship } from '@/lib/auth/session';
import { buildUniverseViewModel } from '@/server/presenters/universe-presenter';
import { eventService } from '@/server/services/event-service';
import { messageService } from '@/server/services/message-service';
import { photoService } from '@/server/services/photo-service';
import { relationshipService } from '@/server/services/relationship-service';

export default async function UniversePage() {
  const { user: sessionUser } = await getSessionUser();
  const relationship =
    sessionUser?.id ? (await relationshipService.getCurrentRelationship(sessionUser.id)).result : null;
  const relationshipId = sessionUser?.id
    ? await resolveSessionRelationship(sessionUser.id, sessionUser.relationshipId)
    : null;
  const events = relationshipId ? (await eventService.listEvents(relationshipId)).result : [];
  const photos = relationshipId ? (await photoService.listTimelinePhotos(relationshipId)).result : [];
  const messages = relationshipId ? (await messageService.listMessages(relationshipId)).result : [];
  const model = buildUniverseViewModel({
    latestEvent: events[0]
      ? {
          memoryDate: events[0].memoryDate.toISOString().slice(0, 10),
          title: events[0].title,
        }
      : null,
    latestMessage: messages[0]
      ? {
          authorName: messages[0].author.displayName,
          content: messages[0].content,
        }
      : null,
    latestPhoto: photos[0]
      ? {
          memoryDate: photos[0].memoryDate?.toISOString().slice(0, 10) ?? null,
          title: `Photo ${photos[0].id}`,
        }
      : null,
    relationship:
      relationship ?? {
      id: 'no-relationship',
      members: sessionUser
        ? [
            {
              id: sessionUser.id,
              displayName: sessionUser.name ?? sessionUser.email ?? 'You',
              email: sessionUser.email ?? '',
            },
          ]
        : [],
      status: 'pending',
      title: 'Memory Universe',
    },
    sessionUser,
  });

  return <UniverseOverview model={model} />;
}
