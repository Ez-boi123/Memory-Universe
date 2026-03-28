import React from 'react';
import type { AccountPageViewModel } from '@/types/account';
import { AccountDangerZone } from './AccountDangerZone';
import { AccountHero } from './AccountHero';
import { AccountRelationshipsSection } from './AccountRelationshipsSection';
import { AccountSecurityCard } from './AccountSecurityCard';
import { RelationCodeCard } from './RelationCodeCard';

interface AccountPageProps {
  model: AccountPageViewModel;
}

export function AccountPage({ model }: AccountPageProps) {
  return (
    <div className="account-page">
      <AccountHero hero={model.hero} />
      <AccountRelationshipsSection relationships={model.relationships} />
      <RelationCodeCard relationCode={model.relationCode} />
      <AccountSecurityCard security={model.security} />
      <AccountDangerZone dangerZone={model.dangerZone} />
    </div>
  );
}
