import Link from 'next/link';

import { registerAction } from '@/app/(auth)/actions';

import { AuthCard } from './AuthCard';

interface SignUpFormProps {
  error?: string;
}

export function SignUpForm({ error }: SignUpFormProps) {
  return (
    <AuthCard
      eyebrow="Auth"
      title="Create Your Account"
      description="Set up your email-and-password account first. Relationship binding comes in the next step."
      error={error}
      footer={
        <p>
          Already have an account? <Link href="/sign-in">Sign in</Link>.
        </p>
      }
    >
      <form action={registerAction} className="auth-form">
        <label className="auth-field">
          <span>Display Name</span>
          <input autoComplete="nickname" name="displayName" required type="text" />
        </label>
        <label className="auth-field">
          <span>Email</span>
          <input autoComplete="email" name="email" required type="email" />
        </label>
        <label className="auth-field">
          <span>Password</span>
          <input autoComplete="new-password" minLength={8} name="password" required type="password" />
        </label>
        <label className="auth-field">
          <span>Confirm Password</span>
          <input
            autoComplete="new-password"
            minLength={8}
            name="confirmPassword"
            required
            type="password"
          />
        </label>
        <button className="auth-submit" type="submit">
          Create Account
        </button>
      </form>
    </AuthCard>
  );
}
