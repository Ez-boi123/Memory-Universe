import { signOutAction } from '@/app/(auth)/actions';

export function SignOutForm() {
  return (
    <form action={signOutAction}>
      <button className="auth-signout" type="submit">
        Sign Out
      </button>
    </form>
  );
}
