import { SignInForm } from '@/components/auth/SignInForm';

interface SignInPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
    callbackUrl?: string;
  }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { error, message, callbackUrl } = await searchParams;

  return <SignInForm callbackUrl={callbackUrl} error={error} message={message} />;
}
