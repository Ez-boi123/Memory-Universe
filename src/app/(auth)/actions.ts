'use server';

import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

import { getDatabaseConfigurationError, isDatabaseConfigured } from '@/lib/env';

function buildRedirectUrl(pathname: string, params: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  const query = searchParams.toString();

  return query ? `${pathname}?${query}` : pathname;
}

export async function registerAction(formData: FormData) {
  const callbackUrl = String(formData.get('callbackUrl') ?? '').trim();

  if (!isDatabaseConfigured()) {
    redirect(
      buildRedirectUrl('/sign-up', {
        error: getDatabaseConfigurationError(),
        ...(callbackUrl ? { callbackUrl } : {}),
      })
    );
  }

  const { authService } = await import('@/server/services/auth-service');
  const result = await authService.register({
    email: String(formData.get('email') ?? ''),
    displayName: String(formData.get('displayName') ?? ''),
    password: String(formData.get('password') ?? ''),
    confirmPassword: String(formData.get('confirmPassword') ?? ''),
  });

  if (!result.ok) {
    redirect(
      buildRedirectUrl('/sign-up', {
        error: result.errors[0] ?? 'Registration failed.',
        ...(callbackUrl ? { callbackUrl } : {}),
      })
    );
  }

  try {
    if (!isDatabaseConfigured()) {
      redirect(
        buildRedirectUrl('/sign-in', {
          error: getDatabaseConfigurationError(),
          ...(callbackUrl ? { callbackUrl } : {}),
        })
      );
    }

    const { signIn } = await import('@/auth');
    await signIn('credentials', {
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
      redirectTo: callbackUrl || '/universe',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(
        buildRedirectUrl('/sign-in', {
          error: 'Account created, but automatic sign-in failed. Please sign in manually.',
          ...(callbackUrl ? { callbackUrl } : {}),
        })
      );
    }

    throw error;
  }
}

export async function signInAction(formData: FormData) {
  const callbackUrl = String(formData.get('callbackUrl') ?? '').trim();

  if (!isDatabaseConfigured()) {
    redirect(
      buildRedirectUrl('/sign-in', {
        error: getDatabaseConfigurationError(),
        ...(callbackUrl ? { callbackUrl } : {}),
      })
    );
  }

  try {
    const { signIn } = await import('@/auth');
    await signIn('credentials', {
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
      redirectTo: callbackUrl || '/universe',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(
        buildRedirectUrl('/sign-in', {
          error: 'Invalid email or password.',
          ...(callbackUrl ? { callbackUrl } : {}),
        })
      );
    }

    throw error;
  }
}

export async function signOutAction() {
  const { signOut } = await import('@/auth');
  await signOut({
    redirectTo: '/sign-in',
  });
}
