import { redirect } from 'next/navigation';

interface EventDetailPageProps {
  params: Promise<{
    eventId: string;
  }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { eventId } = await params;
  redirect(`/planet?eventId=${encodeURIComponent(eventId)}`);
}
