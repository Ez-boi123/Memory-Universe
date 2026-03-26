import Link from 'next/link';

import { signInAction } from '@/app/(auth)/actions';

import { AuthCard } from './AuthCard';

interface SignInFormProps {
  error?: string;
}

export function SignInForm({ error }: SignInFormProps) {
  return (
    <AuthCard
      eyebrow="Auth"
      title="Sign In"
      description="Sign in with your email and password to enter the shared memory space."
      error={error}
      footer={
        <p>
          Need an account? <Link href="/sign-up">Create one</Link>. Forgot your password?{' '}
          <Link href="/forgot-password">Reset it later</Link>.
        </p>
      }
    >
      <form action={signInAction} className="auth-form">
        <label className="auth-field">
          <span>Email</span>
          <input autoComplete="email" name="email" required type="email" />
        </label>
        <label className="auth-field">
          <span>Password</span>
          <input autoComplete="current-password" name="password" required type="password" />
        </label>
        <button className="auth-submit" type="submit">
          Sign In
        </button>
      </form>
    </AuthCard>
  );
}
