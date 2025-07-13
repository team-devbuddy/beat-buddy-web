// participate/[eventId]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import ParticipateForm from '@/components/units/Event/Participate/PaticipationForm';
import EventWriteHeader from '@/components/units/Event/Write/EventWriteHeader';

export default function ParticipatePage() {
  const params = useParams();
  const eventId = params?.eventId?.toString();
  console.log('eventId', eventId);
  if (!eventId) {
    return <div>Event not found</div>;
  }

  return (
    <main className="min-h-screen bg-BG-black text-white">
      <EventWriteHeader />
      <ParticipateForm eventId={eventId} />
    </main>
  );
}
