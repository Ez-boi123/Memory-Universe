import Link from 'next/link';

import { auth } from '@/auth';

export default async function LandingPage() {
  const session = await auth();

  return (
    <div className="page-shell">
      <section className="page-card">
        <p className="page-eyebrow">Public</p>
        <h1 className="page-title">A Quiet Place For Shared Memories</h1>
        <p className="page-description">
          This entry page now exposes the real account entry points for the MVP scaffold. The
          relationship setup and module content still remain intentionally minimal.
        </p>
        <div className="placeholder-grid">
          <div className="placeholder-panel">
            <h2>Account Access</h2>
            <p>
              {session?.user
                ? `Signed in as ${session.user.name ?? session.user.email}.`
                : 'Create an account or sign in with email and password.'}
            </p>
            <div className="entry-actions">
              {session?.user ? (
                <Link className="entry-button" href="/universe">
                  Enter Universe
                </Link>
              ) : (
                <>
                  <Link className="entry-button" href="/sign-up">
                    Create Account
                  </Link>
                  <Link className="entry-button entry-button-secondary" href="/sign-in">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="placeholder-panel">
            <h2>What Comes Next</h2>
            <p>TODO: relationship creation, invite acceptance, and module-level business flows.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
