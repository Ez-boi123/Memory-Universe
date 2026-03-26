import { EventDetailPlaceholder } from '@/components/planet/EventDetailPlaceholder';

interface EventDetailPageProps {
  params: Promise<{
    eventId: string;
  }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { eventId } = await params;

  return <EventDetailPlaceholder eventId={eventId} />;
}
