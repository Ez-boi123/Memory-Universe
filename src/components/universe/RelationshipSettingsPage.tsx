import { bindRelationshipByCodeAction } from '@/app/(app)/settings/relationship/actions';
import { ModulePageHeader } from '@/components/universe/ModulePageHeader';
import type { RelationshipSummary, SessionUserSummary } from '@/types/domain';

interface RelationshipSettingsPageProps {
  currentRelationship: RelationshipSummary | null;
  error?: string;
  sessionUser: SessionUserSummary | null;
  success?: string;
}

export function RelationshipSettingsPage({
  currentRelationship,
  error,
  sessionUser,
  success,
}: RelationshipSettingsPageProps) {
  const isBound = Boolean(currentRelationship);

  return (
    <div className="module-page-layout">
      <ModulePageHeader
        eyebrow="Settings"
        title="Relationship Settings"
        description="Bind a relationship by entering another user's personal relation code."
        actionLabel={isBound ? 'Connected' : 'Bind Relationship'}
      />
      <section className="placeholder-page-card">
        <div className="placeholder-grid">
          <div className="placeholder-panel">
            <h2>Your Personal Relation Code</h2>
            <p>{sessionUser?.relationCode ?? 'MU-USER-2048'}</p>
            <p>
              Share this code with the other person. They can enter it once to create the shared
              relationship.
            </p>
          </div>
          <div className="placeholder-panel">
            <h2>Bind With Another User</h2>
            {error ? <p className="auth-error">{error}</p> : null}
            {success ? <p className="auth-message">{success}</p> : null}
            {isBound ? (
              <p>
                Your account is already connected to{' '}
                {currentRelationship?.title ?? 'a shared relationship'}.
              </p>
            ) : (
              <form action={bindRelationshipByCodeAction} className="auth-form">
                <label className="auth-field">
                  <span>Other User&apos;s Relation Code</span>
                  <input
                    autoComplete="off"
                    name="relationCode"
                    placeholder="Enter the other user's code"
                    required
                    type="text"
                  />
                </label>
                <button className="auth-submit" type="submit">
                  Bind Relationship
                </button>
              </form>
            )}
          </div>
          <div className="placeholder-panel">
            <h2>Current Relationship</h2>
            {currentRelationship ? (
              <>
                <p>{currentRelationship.title}</p>
                <p>Status: {currentRelationship.status}</p>
                <p>
                  Members:{' '}
                  {currentRelationship.members.map((member) => member.displayName).join(' · ')}
                </p>
              </>
            ) : (
              <p>No relationship is connected yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
