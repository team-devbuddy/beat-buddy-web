'use client';

import { useRouter } from 'next/navigation';
import EventDetailHeader from '../Detail/EventDetailHeader';

export default function EventWriteHeader() {
  const router = useRouter();
  return (
      <EventDetailHeader handleBackClick={() => router.push(`/event`)} />
  );
}
