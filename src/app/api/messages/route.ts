import { getSessionUser, resolveSessionRelationship } from '@/lib/auth/session';
import { messageService } from '@/server/services/message-service';

export async function GET() {
  const { user } = await getSessionUser();

  if (!user?.id) {
    return Response.json({ message: 'You need to sign in first.', ok: false }, { status: 401 });
  }

  const relationshipId = await resolveSessionRelationship(user.id, user.relationshipId);

  if (!relationshipId) {
    return Response.json(
      { message: 'A relationship space is required before viewing messages.', ok: false },
      { status: 400 },
    );
  }

  const result = await messageService.listMessages(relationshipId);

  return Response.json({ messages: result.result, ok: true });
}

export async function POST(request: Request) {
  const { user } = await getSessionUser();

  if (!user?.id) {
    return Response.json({ message: 'You need to sign in first.', ok: false }, { status: 401 });
  }

  const relationshipId = await resolveSessionRelationship(user.id, user.relationshipId);

  if (!relationshipId) {
    return Response.json(
      { message: 'A relationship space is required before writing messages.', ok: false },
      { status: 400 },
    );
  }

  const payload = (await request.json()) as {
    content?: string;
  };
  const result = await messageService.createMessage({
    authorId: user.id,
    content: payload.content ?? '',
    relationshipId,
  });

  if (!result.ok) {
    return Response.json({ errors: result.errors, ok: false }, { status: 400 });
  }

  return Response.json({ message: result.message, ok: true }, { status: 201 });
}
