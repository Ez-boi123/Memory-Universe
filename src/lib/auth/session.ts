import { auth } from '@/auth';

export async function getSessionUser() {
  const session = await auth();

  return {
    user: session?.user ?? null,
    note:
      'TODO: replace placeholder session data with real relationship-aware session enrichment.',
  };
}
