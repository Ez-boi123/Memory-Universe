import Link from 'next/link';

import { signInAction } from '@/app/(auth)/actions';

import { AuthCard } from './AuthCard';

interface SignInFormProps {
  error?: string;
  message?: string;
  callbackUrl?: string;
}

export function SignInForm({ error, message, callbackUrl }: SignInFormProps) {
  return (
    <AuthCard
      eyebrow="Auth"
      title="Sign In"
      description="Sign in with your email and password to enter the shared memory space."
      mode="sign-in"
      error={error}
      message={message}
      footer={
        <p>
          Need an account?{' '}
          <Link href={callbackUrl ? `/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/sign-up'}>
            Create one
          </Link>
          . Forgot your password?{' '}
          <Link href="/forgot-password">Reset it later</Link>.
        </p>
      }
    >
      <form action={signInAction} className="auth-form">
        <input name="callbackUrl" type="hidden" value={callbackUrl ?? ''} />
        <label className="auth-field">
          <span>Email</span>
          <input autoComplete="email" name="email" required type="email" />
        </label>
        <label className="auth-field">
          <span>Password</span>
          <input autoComplete="current-password" name="password" required type="password" />
        </label>
        <div className="auth-form-note">
          Your memory universe stays private by default and only opens inside authenticated spaces.
        </div>
        <button className="auth-submit" type="submit">
          Sign In
        </button>
      </form>
    </AuthCard>
  );
}
