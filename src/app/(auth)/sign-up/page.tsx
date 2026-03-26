import { SignUpForm } from '@/components/auth/SignUpForm';

interface SignUpPageProps {
  searchParams: Promise<{
    error?: string;
    callbackUrl?: string;
  }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { error, callbackUrl } = await searchParams;

  return <SignUpForm callbackUrl={callbackUrl} error={error} />;
}
