import { getSessionUser, resolveSessionRelationship } from '@/lib/auth/session';
import { photoService } from '@/server/services/photo-service';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { user } = await getSessionUser();

  if (!user?.id) {
    return Response.json(
      {
        message: 'You need to sign in before uploading images.',
        ok: false,
      },
      {
        status: 401,
      },
    );
  }

  const relationshipId = await resolveSessionRelationship(user.id, user.relationshipId);

  if (!relationshipId) {
    return Response.json(
      {
        message: 'A relationship space is required before uploading images.',
        ok: false,
      },
      {
        status: 400,
      },
    );
  }

  const requestFormData = await request.formData();
  const file = requestFormData.get('file');
  const archiveDirectly = requestFormData.get('archiveDirectly') === 'true';
  const eventTitle = String(requestFormData.get('eventTitle') ?? '');
  const memoryDate = String(requestFormData.get('memoryDate') ?? '');
  const note = String(requestFormData.get('note') ?? '');

  if (!(file instanceof File)) {
    return Response.json(
      {
        message: 'Upload requests must include a file.',
        ok: false,
      },
      {
        status: 400,
      },
    );
  }

  const result = await photoService.uploadPhoto({
    archiveDirectly,
    eventTitle,
    file,
    memoryDate,
    note,
    relationshipId,
    uploadedBy: user.id,
  });

  if (!result.ok) {
    return Response.json(
      {
        errors: result.errors,
        ok: false,
      },
      {
        status: 400,
      },
    );
  }

  return Response.json({
    ok: true,
    photo: 'photo' in result ? result.photo : null,
    upload: result.upload,
  });
}

export async function DELETE(request: NextRequest) {
  const { user } = await getSessionUser();

  if (!user?.id) {
    return Response.json(
      {
        message: 'You need to sign in before removing uploaded images.',
        ok: false,
      },
      {
        status: 401,
      },
    );
  }

  const relationshipId = await resolveSessionRelationship(user.id, user.relationshipId);

  if (!relationshipId) {
    return Response.json(
      {
        message: 'A relationship space is required before removing uploaded images.',
        ok: false,
      },
      {
        status: 400,
      },
    );
  }

  const body = (await request.json()) as {
    uploadIds?: string[];
  };
  const uploadIds = body.uploadIds?.filter(Boolean) ?? [];

  if (uploadIds.length === 0) {
    return Response.json(
      {
        message: 'Cleanup requests must include at least one upload id.',
        ok: false,
      },
      {
        status: 400,
      },
    );
  }

  const result = await photoService.deleteTemporaryUploads({
    uploadIds,
    relationshipId,
    uploadedBy: user.id,
  });

  if (!result.ok) {
    return Response.json(
      {
        errors: result.errors,
        ok: false,
      },
      {
        status: 400,
      },
    );
  }

  return Response.json({
    ok: true,
  });
}
