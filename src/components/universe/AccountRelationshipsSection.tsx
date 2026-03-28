import React from 'react';
import type { AccountRelationshipsSectionViewModel } from '@/types/account';
import { AccountRelationshipCard } from './AccountRelationshipCard';

interface AccountRelationshipsSectionProps {
  relationships: AccountRelationshipsSectionViewModel;
}

export function AccountRelationshipsSection({
  relationships,
}: AccountRelationshipsSectionProps) {
  return (
    <section
      className="account-section account-section--relationships"
      aria-labelledby="account-relationships-title"
    >
      <h2 className="account-section-title" id="account-relationships-title">
        <span className="account-section-title-row">
          <span className="account-section-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 4.5 5 8.25v7.5L12 19.5l7-3.75v-7.5L12 4.5Z" />
              <path d="M5 8.25 12 12l7-3.75" />
              <path d="M12 12v7.5" />
            </svg>
          </span>
          <span>{relationships.title}</span>
        </span>
      </h2>
      {relationships.description ? (
        <p className="account-section-description">{relationships.description}</p>
      ) : null}

      {relationships.items.length === 0 ? (
        <div className="account-empty-state">
          <h3>{relationships.emptyTitle}</h3>
          <p>{relationships.emptyBody}</p>
        </div>
      ) : (
        <div className="account-relationship-list">
          {relationships.items.map((item) => (
            <AccountRelationshipCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
