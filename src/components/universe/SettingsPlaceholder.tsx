import React from 'react';
import { ModulePageHeader } from '@/components/universe/ModulePageHeader';

interface SettingsPlaceholderProps {
  scope: 'relationship' | 'account';
}

export function SettingsPlaceholder({ scope }: SettingsPlaceholderProps) {
  const isAccountScope = scope === 'account';
  const eyebrow = isAccountScope ? 'Profile' : 'Settings';
  const title = isAccountScope ? 'Account Settings' : 'Relationship Settings';
  const description = isAccountScope
    ? 'TODO: profile editing, password management, and account-level preferences.'
    : 'TODO: invite generation, frozen-state messaging, and relationship lifecycle controls.';
  const actionLabel = isAccountScope ? 'Update Profile' : 'Update Relationship';
  const bodyCopy = isAccountScope
    ? 'Placeholder account surface for profile details, password controls, and personal preferences.'
    : 'Placeholder relationship surface for invite tools, member management, and frozen-state notes.';

  return (
    <div className="module-page-layout">
      <ModulePageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actionLabel={actionLabel}
      />
      <section className="placeholder-page-card">
        <p className="page-description">{bodyCopy}</p>
      </section>
    </div>
  );
}
