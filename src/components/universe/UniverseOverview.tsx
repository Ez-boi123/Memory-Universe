import { UniverseArchiveNote } from '@/components/universe/UniverseArchiveNote';
import { UniverseHero } from '@/components/universe/UniverseHero';
import { UniverseModuleGallery } from '@/components/universe/UniverseModuleGallery';
import { UniverseRecentPreview } from '@/components/universe/UniverseRecentPreview';
import type { UniversePageViewModel } from '@/types/universe';

interface UniverseOverviewProps {
  model: UniversePageViewModel;
}

export function UniverseOverview({ model }: UniverseOverviewProps) {
  return (
    <div className="universe-overview">
      <UniverseHero hero={model.hero} />
      <UniverseModuleGallery items={model.moduleGallery} />
      <UniverseRecentPreview items={model.recentPreview} />
      <UniverseArchiveNote note={model.archiveNote} />
    </div>
  );
}
