'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { eventSearch } from '@/lib/actions/event-controller/eventSearch';
import { accessTokenState } from '@/context/recoil-context';
import BoardSearchHeader from '@/components/units/Board/Search/BoardSearchHeader';
import EventSearchResults from '@/components/units/Event/EventSearchResults';
import BoardRecentTerm from '@/components/units/Board/Search/BoardRecentTerm';
import NoResults from '@/components/units/Search/NoResult';
import { useRecoilValue } from 'recoil';
import { userProfileState } from '@/context/recoil-context';

interface EventSearchResultType {
  eventId: number;
  title: string;
  content: string;
  images: string[];
  liked: boolean;
  likes: number;
  views: number;
  startDate: string;
  endDate: string;
  receiveInfo: boolean;
  receiveName: boolean;
  receiveGender: boolean;
  receivePhoneNumber: boolean;
  receiveSNSId: boolean;
  receiveMoney: boolean;
  depositAccount: string;
  depositAmount: number;
  isAuthor: boolean;
}

const PAGE_SIZE = 10;

export default function EventSearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') ?? '';
  const pathname = usePathname();
  const router = useRouter();
  const userProfile = useRecoilValue(userProfileState);
  const [events, setEvents] = useState<EventSearchResultType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const accessToken = useRecoilValue(accessTokenState) || '';

  const observer = useRef<IntersectionObserver | null>(null);
  const lastEventRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  const fetchSearchEvents = useCallback(
    async (targetPage: number) => {
      if (loading) return;
      setLoading(true);

      try {
        if (selectedTags.length === 0) {
          const response = await eventSearch(keyword, accessToken, targetPage, PAGE_SIZE);
          const apiEvents = response.data.eventResponseDTOS;
          // API 응답을 기존 구조로 변환
          const newEvents = apiEvents.map((event: any) => ({
            eventId: event.eventId,
            title: event.title || '',
            content: event.content,
            images: event.thumbImage ? [event.thumbImage] : [],
            liked: event.liked,
            likes: event.likes,
            views: event.views,
            startDate: event.startDate,
            endDate: event.endDate,
            receiveInfo: false,
            receiveName: false,
            receiveGender: false,
            receivePhoneNumber: false,
            receiveSNSId: false,
            receiveMoney: false,
            depositAccount: '',
            depositAmount: 0,
            isAuthor: event.isAuthor,
          }));
          if (newEvents.length < PAGE_SIZE) setHasMore(false);
          setEvents((prevEvents) => (targetPage === 1 ? newEvents : [...prevEvents, ...newEvents]));
        } else {
          const responses = await Promise.all(
            selectedTags.map((tag) => eventSearch(tag, accessToken, targetPage, PAGE_SIZE)),
          );
          const apiEvents = responses.flatMap((response) => response.data.eventResponseDTOS);
          // API 응답을 기존 구조로 변환
          const merged = apiEvents.map((event: any) => ({
            eventId: event.eventId,
            title: event.title || '',
            content: event.content,
            images: event.thumbImage ? [event.thumbImage] : [],
            liked: event.liked,
            likes: event.likes,
            views: event.views,
            startDate: event.startDate,
            endDate: event.endDate,
            receiveInfo: false,
            receiveName: false,
            receiveGender: false,
            receivePhoneNumber: false,
            receiveSNSId: false,
            receiveMoney: false,
            depositAccount: '',
            depositAmount: 0,
            isAuthor: event.isAuthor,
          }));
          if (merged.length < PAGE_SIZE * selectedTags.length) setHasMore(false);

          setEvents((prevEvents) => {
            const combined = targetPage === 1 ? merged : [...prevEvents, ...merged];
            const unique = [...new Map(combined.map((event) => [event.eventId, event])).values()];
            return unique;
          });
        }
      } catch (err) {
        console.error('이벤트 게시글 로드 실패:', err);
      } finally {
        setLoading(false);
      }
    },
    [keyword, accessToken, selectedTags],
  );

  useEffect(() => {
    if (!isInitialized || !pathname) return;
    localStorage.setItem('selectedTags', JSON.stringify(selectedTags));
    localStorage.setItem('selectedTags_path', pathname);
    setEvents([]);
    setPage(1);
    setHasMore(true);
    fetchSearchEvents(1);
  }, [keyword, selectedTags, pathname, isInitialized, fetchSearchEvents]);

  useEffect(() => {
    if (!isInitialized || page === 1) return;
    fetchSearchEvents(page);
  }, [page, isInitialized, fetchSearchEvents]);

  useEffect(() => {
    if (!pathname) return;
    const stored = localStorage.getItem('selectedTags');
    const storedPath = localStorage.getItem('selectedTags_path');

    if (stored && storedPath === pathname) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setSelectedTags(parsed);
      } catch (e) {
        console.error('로컬스토리지 파싱 실패:', e);
        setSelectedTags([]);
      }
    } else {
      localStorage.removeItem('selectedTags');
      localStorage.setItem('selectedTags_path', pathname);
      setSelectedTags([]);
    }
    setIsInitialized(true);
  }, [pathname]);

  const handleUpdateEvents = (tags: string[]) => {
    setSelectedTags(tags);
  };

  const handleSearchSubmit = () => {
    setEvents([]);
    setPage(1);
    setHasMore(true);
    fetchSearchEvents(1);
  };

  return (
    <main className="bg-BG-black text-white">
      <BoardSearchHeader placeholder="검색어를 입력해주세요" onSearchSubmit={handleSearchSubmit} isEvent={true} />
      {keyword === '' && <BoardRecentTerm isEvent={true} />}

      {events.map((event, i) => {
        if (i === events.length - 1) {
          return (
            <div ref={lastEventRef} key={event.eventId}>
              <EventSearchResults startDate={event.startDate} endDate={event.endDate} />
            </div>
          );
        } else {
          return <EventSearchResults key={event.eventId} startDate={event.startDate} endDate={event.endDate} />;
        }
      })}

      {!loading && events.length === 0 && keyword !== '' && (
        <NoResults text="조건에 맞는 검색 결과가 없어요" fullHeight={true} />
      )}
    </main>
  );
}
