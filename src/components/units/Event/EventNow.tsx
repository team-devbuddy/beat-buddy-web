'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getNowEvent } from '@/lib/actions/event-controller/getNowEvent';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import EventCard from './EventCard';

interface EventType {
  eventId: number;
  title: string;
  content: string;
  thumbImage: string;
  location: string;
  likes: number;
  views: number;
  startDate: string;
  endDate: string;
  isAuthor: boolean;
  liked?: boolean;
}

export default function EventNow({ refreshTrigger }: { refreshTrigger: boolean }) {
  const [events, setEvents] = useState<EventType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const accessToken = useRecoilValue(accessTokenState) || '';

  const fetchEvents = useCallback(async () => {
    try {
      const response = await getNowEvent(accessToken, 'latest', page, 10);
      const newEvents = response?.data?.eventResponseDTOS ?? [];

      if (newEvents.length === 0) {
        setHasMore(false);
      } else {
        setEvents(prev => {
          const existingIds = new Set(prev.map(e => e.eventId));
          const uniqueNew = newEvents.filter((e: EventType) => !existingIds.has(e.eventId));
          return [...prev, ...uniqueNew];
        });
      }
    } catch (err) {
      console.error('이벤트를 불러오지 못했습니다.', err);
    }
  }, [accessToken, page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, refreshTrigger]);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1 }
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore]);

  return (
    <div className="space-y-6 ">
      {events.map((event, i) => (
          <EventCard
          accessToken={accessToken}
          key={event.eventId}
          event={event}
          lastRef={i === events.length - 1 ? observerRef : null}
        />
      ))}
    </div>
  );
}
