export interface ConstellationHeroViewModel {
  eyebrow: string;
  title: string;
  lead: string;
  description: string;
}

export interface ConstellationMessageCardViewModel {
  id: string;
  authorName: string;
  content: string;
  createdAtLabel: string;
}

export interface ConstellationEmptyStateViewModel {
  title: string;
  description: string;
}

export interface ConstellationFloatingActionViewModel {
  ariaLabel: string;
}

export interface ConstellationComposerViewModel {
  title: string;
  helperText: string;
  placeholder: string;
  submitLabel: string;
  cancelLabel: string;
  maxLength: number;
}

export interface ConstellationPageViewModel {
  hero: ConstellationHeroViewModel;
  messages: ConstellationMessageCardViewModel[];
  emptyState: ConstellationEmptyStateViewModel;
  floatingAction: ConstellationFloatingActionViewModel;
  composer: ConstellationComposerViewModel;
}
