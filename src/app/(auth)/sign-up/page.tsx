import { SignUpForm } from '@/components/auth/SignUpForm';

interface SignUpPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { error } = await searchParams;

  return <SignUpForm error={error} />;
}
