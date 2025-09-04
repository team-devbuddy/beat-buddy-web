'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { eventSearch } from '@/lib/actions/event-controller/eventSearch';
import EventLists from './EventLists';
import { EventType } from './EventContainer';

interface EventSearchResultsProps {
  startDate: string;
  endDate: string;
  keyword?: string; // keyword prop 추가
}

export default function EventSearchResults({ startDate, endDate, keyword = '' }: EventSearchResultsProps) {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const accessToken = useRecoilValue(accessTokenState);

  // ISO 날짜 형식을 yyyy-MM-dd 형식으로 변환
  const formatDateForAPI = (isoDate: string) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formattedStartDate = formatDateForAPI(startDate);
  const formattedEndDate = formatDateForAPI(endDate);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // 무한스크롤 콜백
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !loading && hasMore) {
        setPage((prev) => prev + 1);
      }
    },
    [loading, hasMore],
  );

  // 이벤트 검색
  const fetchEvents = useCallback(
    async (pageNum: number) => {
      if (!accessToken || loading) return;

      try {
        setLoading(true);
        const newEvents = await eventSearch(keyword, accessToken, pageNum, 10, formattedStartDate, formattedEndDate);

        console.log('🔍 EventSearchResults - API 응답:', newEvents);

        if (newEvents && newEvents.length > 0) {
          if (pageNum === 1) {
            setEvents(newEvents);
          } else {
            setEvents((prev) => [...prev, ...newEvents]);
          }

          // 반환된 데이터 길이로 hasMore 판단
          setHasMore(newEvents.length === 10);
        } else {
          console.log('🔍 EventSearchResults - 응답이 비어있음');
          setHasMore(false);
        }
      } catch (error) {
        console.error('이벤트 게시글 로드 실패:', error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [formattedStartDate, formattedEndDate, accessToken, keyword],
  );

  // 페이지 변경 시 이벤트 검색
  useEffect(() => {
    fetchEvents(page);
  }, [page, fetchEvents]);

  // 날짜 범위 변경 시 초기화
  useEffect(() => {
    setEvents([]);
    setPage(1);
    setHasMore(true);
  }, [startDate, endDate]);

  // Intersection Observer 설정
  useEffect(() => {
    if (loadingRef.current) {
      observerRef.current = new IntersectionObserver(handleIntersection, {
        threshold: 0.1,
      });
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection]);

  if (events.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <img src="/icons/grayLogo.svg" alt="BeatBuddy Logo" className="mb-6 h-16 w-16" />
        <p className="text-body2-15-medium text-gray300">해당 기간에 등록된 이벤트가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="px-5 pt-5">
      <EventLists
        tab="upcoming"
        events={events}
        setEvents={setEvents}
        onLoadMore={() => setPage((prev) => prev + 1)}
        hasMore={hasMore}
        loading={loading}
      />
    </div>
  );
}
