import { ConstellationPage as ConstellationPageView } from '@/components/constellation/ConstellationPage';
import { getSessionUser, resolveSessionRelationship } from '@/lib/auth/session';
import { buildConstellationViewModel } from '@/server/presenters/constellation-presenter';
import { messageService } from '@/server/services/message-service';

export default async function Page() {
  const { user } = await getSessionUser();
  const relationshipId = user?.id
    ? await resolveSessionRelationship(user.id, user.relationshipId)
    : null;
  const messages = relationshipId ? (await messageService.listMessages(relationshipId)).result : [];
  const model = buildConstellationViewModel({
    messages: messages.map((message) => ({
      authorName: message.author.displayName,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
      id: message.id,
    })),
  });

  return <ConstellationPageView model={model} />;
}
