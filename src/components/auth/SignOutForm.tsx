import { signOutAction } from '@/app/(auth)/actions';

interface SignOutFormProps {
  label?: string;
  className?: string;
  buttonClassName?: string;
}

export function SignOutForm({
  label = 'Sign Out',
  className,
  buttonClassName,
}: SignOutFormProps) {
  return (
    <form action={signOutAction} className={className}>
      <button className={buttonClassName ? `auth-signout ${buttonClassName}` : 'auth-signout'} type="submit">
        {label}
      </button>
    </form>
  );
}
