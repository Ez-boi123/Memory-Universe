'use server';

import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

import { signIn, signOut } from '@/auth';
import { authService } from '@/server/services/auth-service';

function buildRedirectUrl(pathname: string, params: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  const query = searchParams.toString();

  return query ? `${pathname}?${query}` : pathname;
}

export async function registerAction(formData: FormData) {
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
      })
    );
  }

  try {
    await signIn('credentials', {
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
      redirectTo: '/universe',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(
        buildRedirectUrl('/sign-in', {
          error: 'Account created, but automatic sign-in failed. Please sign in manually.',
        })
      );
    }

    throw error;
  }
}

export async function signInAction(formData: FormData) {
  try {
    await signIn('credentials', {
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
      redirectTo: '/universe',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(
        buildRedirectUrl('/sign-in', {
          error: 'Invalid email or password.',
        })
      );
    }

    throw error;
  }
}

export async function signOutAction() {
  await signOut({
    redirectTo: '/',
  });
}
