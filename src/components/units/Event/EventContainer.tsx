'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import EventLists from './EventLists';
import { getUpcomingEvent } from '@/lib/actions/event-controller/getUpcomingEvent';
import { getPastEvent } from '@/lib/actions/event-controller/getPastEvent';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';

export interface EventType {
  eventId: number;
  title: string;
  content: string;
  thumbImage: string;
  location: string;
  likes: number;
  views: number;
  startDate: string;
  endDate: string;
  liked?: boolean;
}

export default function EventContainer({ tab, refreshTrigger }: { tab: 'upcoming' | 'past'; refreshTrigger: boolean }) {
  const accessToken = useRecoilValue(accessTokenState) || '';
  const [events, setEvents] = useState<EventType[]>([]);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchMoreEvents = useCallback(async () => {
    try {
      const res =
        tab === 'upcoming'
          ? await getUpcomingEvent(accessToken, 'latest', page, 10)
          : await getPastEvent(accessToken, 'latest', page, 10);

      if (!Array.isArray(res) || res.length === 0) {
        setHasMore(false);
        return;
      }

      const newEvents = res.map((event) => ({
        ...event,
        liked: event.liked ?? false,
        likes: event.likes ?? 0,
      }));

      // 중복 제거
      setEvents((prev) => {
        const ids = new Set(prev.map((e) => e.eventId));
        const filtered = newEvents.filter((e) => !ids.has(e.eventId));
        return [...prev, ...filtered];
      });
    } catch (err) {
      console.error('이벤트 불러오기 실패', err);
      setHasMore(false);
    }
  }, [tab, page, accessToken]);

  useEffect(() => {
    // 탭 바뀌면 초기화 후 첫 페이지 fetch
    const init = async () => {
      const res =
        tab === 'upcoming'
          ? await getUpcomingEvent(accessToken, 'latest', 1, 10)
          : await getPastEvent(accessToken, 'latest', 1, 10);

      const newEvents = (res || []).map((event: EventType) => ({
        ...event,
        liked: event.liked ?? false,
        likes: event.likes ?? 0,
      }));

      setEvents(newEvents);
      setPage(2); // 다음 요청은 page 2부터 시작
      setHasMore(true);
    };

    init();
  }, [tab, accessToken]);

  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 },
    );

    observer.current.observe(loaderRef.current);
  }, [loaderRef, hasMore]);

  useEffect(() => {
    if (page > 2) fetchMoreEvents(); // page가 올라갔을 때만 호출
  }, [page]);

  useEffect(() => {
    // 새로고침 트리거가 바뀔 때마다 리스트 초기화 후 새로 fetch
    const refresh = async () => {
      const res =
        tab === 'upcoming'
          ? await getUpcomingEvent(accessToken, 'latest', 1, 10)
          : await getPastEvent(accessToken, 'latest', 1, 10);

      const newEvents = (res || []).map((event: EventType) => ({
        ...event,
        liked: event.liked ?? false,
        likes: event.likes ?? 0,
      }));

      setEvents(newEvents);
      setPage(2);
      setHasMore(true);
    };

    refresh();
  }, [refreshTrigger]);

  return (
    <div className="min-h-screen bg-BG-black">
      <EventLists tab={tab} events={events} setEvents={setEvents} />
      {hasMore && <div ref={loaderRef} className="h-10 w-full" />}
    </div>
  );
}
