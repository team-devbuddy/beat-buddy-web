'use client';

import EventDetailPage from "@/components/units/Event/Detail/EventDetailPage";

export default function EventPage({ params }: { params: { eventId: string } }) {
  return <EventDetailPage eventId={params.eventId} />;
}
