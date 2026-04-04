export interface AccountHeroViewModel {
  eyebrow: string;
  displayName: string;
  email: string;
  identityLine: string;
  avatarLabel: string;
  summaryLabel: string;
  summaryValue: string;
  relationshipCountLabel: string;
  relationshipCountValue: string;
}

export interface AccountRelationshipCardViewModel {
  id: string;
  title: string;
  memberSummary: string;
  statusLabel: string;
  emotionalNote: string;
  href: string;
  editLabel: string;
  enterLabel: string;
}

export interface AccountRelationshipsSectionViewModel {
  title: string;
  description: string;
  emptyTitle: string;
  emptyBody: string;
  items: AccountRelationshipCardViewModel[];
}

export interface RelationCodeCardViewModel {
  title: string;
  description: string;
  code: string;
  copyLabel: string;
  bindLabel: string;
  bindHint: string;
  bindError?: string;
  bindSuccess?: string;
}

export interface AccountSecurityCardViewModel {
  title: string;
  description: string;
  actionLabel: string;
  helperText: string;
}

export interface AccountDangerZoneViewModel {
  title: string;
  description: string;
  signOutLabel: string;
  deleteLabel: string;
  deleteHint: string;
}

export interface AccountPageViewModel {
  hero: AccountHeroViewModel;
  relationships: AccountRelationshipsSectionViewModel;
  relationCode: RelationCodeCardViewModel;
  security: AccountSecurityCardViewModel;
  dangerZone: AccountDangerZoneViewModel;
}
