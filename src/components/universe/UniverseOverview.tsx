import { SectionPanel } from '@/components/ui/SectionPanel';
import { presentRelationshipSummary } from '@/server/presenters/relationship-presenter';

export function UniverseOverview() {
  const relationship = presentRelationshipSummary();

  return (
    <section className="page-card">
      <p className="page-eyebrow">Memory Universe</p>
      <h1 className="page-title">{relationship.title}</h1>
      <p className="page-description">
        TODO: relationship hero, highlights, and recent activity will be implemented in later
        phases. This scaffold only reserves the module structure.
      </p>
      <div className="placeholder-grid">
        <SectionPanel
          title="Relationship Identity"
          description={`Status: ${relationship.status}. TODO: show invite state, members, and frozen-state messaging.`}
        />
        <SectionPanel
          title="Quick Entries"
          description="TODO: expose one-click entry cards for Planet, Milky Way, and Constellation."
        />
        <SectionPanel
          title="Recent Highlights"
          description="TODO: aggregate recent events, archived photos, and messages without implementing real feeds yet."
        />
      </div>
    </section>
  );
}
