interface SettingsPlaceholderProps {
  scope: 'relationship' | 'account';
}

export function SettingsPlaceholder({ scope }: SettingsPlaceholderProps) {
  const title = scope === 'relationship' ? 'Relationship Settings' : 'Account Settings';
  const description =
    scope === 'relationship'
      ? 'TODO: invite generation, frozen-state messaging, and relationship lifecycle controls.'
      : 'TODO: profile editing, password management, and account-level preferences.';

  return (
    <section className="page-card">
      <p className="page-eyebrow">Settings</p>
      <h1 className="page-title">{title}</h1>
      <p className="page-description">{description}</p>
    </section>
  );
}
