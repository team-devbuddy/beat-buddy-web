'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getNowEvent } from '@/lib/actions/event-controller/getNowEvent';
import { useRecoilValue } from 'recoil';
import { accessTokenState, regionState } from '@/context/recoil-context';
import EventCard from './EventCard';
import { formatDate, formatDateRange, formatRegion } from './EventLists';

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
  region: string;
}

export default function EventNow({ refreshTrigger }: { refreshTrigger: boolean }) {
  const [events, setEvents] = useState<EventType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const accessToken = useRecoilValue(accessTokenState) || '';
  const region = useRecoilValue(regionState);
  const isFirstRender = useRef(true); 

  const fetchEvents = useCallback(async () => {
    try {
      const response = await getNowEvent(accessToken, region, page, 10);
      const newEvents = response?.data?.eventResponseDTOS ?? [];

      if (newEvents.length === 0) {
        setHasMore(false);
      } else {
        setEvents((prev) => {
          const existingIds = new Set(prev.map((e) => e.eventId));
          const uniqueNew = newEvents.filter((e: EventType) => !existingIds.has(e.eventId));
          return [...prev, ...uniqueNew];
        });
      }
    } catch (err) {
      console.error('이벤트를 불러오지 못했습니다.', err);
    }
  }, [accessToken, page, region]);

 useEffect(() => {
  if (isFirstRender.current) {
    isFirstRender.current = false;
    // ✅ 최초 렌더링 시 region 없이 호출
    getNowEvent(accessToken, [], 1, 10).then((response) => {
      const newEvents = response?.data?.eventResponseDTOS ?? [];
      setEvents(newEvents);
      setHasMore(newEvents.length > 0);
    });
  } else {
    // ✅ 이후 region이 바뀌거나 refreshTrigger 발생 시 region 포함해서 fetch
    setPage(1); // 페이지 초기화
    setEvents([]); // 기존 이벤트 초기화
    setHasMore(true);
    fetchEvents(); // region 포함 호출
  }
}, [region, refreshTrigger, accessToken]);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 },
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore]);

  return (
    <div className="space-y-6">
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
