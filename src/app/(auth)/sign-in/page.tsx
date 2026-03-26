import { SignInForm } from '@/components/auth/SignInForm';

interface SignInPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { error } = await searchParams;

  return <SignInForm error={error} />;
}
