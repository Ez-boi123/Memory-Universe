'use server';

import { redirect } from 'next/navigation';

import { getSessionUser } from '@/lib/auth/session';
import { relationshipService } from '@/server/services/relationship-service';

function buildRedirectUrl(pathname: string, params: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  const query = searchParams.toString();

  return query ? `${pathname}?${query}` : pathname;
}

export async function bindRelationshipByCodeAction(formData: FormData) {
  const returnTo = String(formData.get('returnTo') ?? '/settings/relationship');
  const { user } = await getSessionUser();

  if (!user?.id) {
    redirect(
      buildRedirectUrl('/sign-in', {
        error: 'Please sign in before binding a relationship.',
      }),
    );
  }

  const result = await relationshipService.bindByRelationCode({
    currentUserId: user.id,
    targetRelationCode: String(formData.get('relationCode') ?? ''),
  });

  if (!result.ok) {
    redirect(
      buildRedirectUrl(returnTo, {
        error: result.error,
      }),
    );
  }

  redirect(
    buildRedirectUrl(returnTo, {
      success: `Relationship bound with ${result.targetUser.displayName}.`,
    }),
  );
}
