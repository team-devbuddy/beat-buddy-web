'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { eventSearch } from '@/lib/actions/event-controller/eventSearch';
import { accessTokenState } from '@/context/recoil-context';
import BoardSearchHeader from '@/components/units/Board/Search/BoardSearchHeader';
import EventCard from '@/components/units/Event/EventCard';
import BoardRecentTerm from '@/components/units/Board/Search/BoardRecentTerm';
import NoResults from '@/components/units/Search/NoResult';
import { useRecoilValue } from 'recoil';
import { userProfileState } from '@/context/recoil-context';
import LocationFilter from '@/components/units/Event/LocationFilter';

interface EventSearchResultType {
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
  const [selectedDateRange, setSelectedDateRange] = useState<{ startDate: string; endDate: string } | null>(null);

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

      // keyword도 없고 selectedTags도 없으면 API 호출하지 않음
      if (!keyword.trim() && selectedTags.length === 0) {
        setLoading(false);
        setEvents([]);
        setHasMore(false);
        return;
      }

      console.log('🔍 검색 시작:', { keyword: keyword.trim(), selectedTags, targetPage });

      setLoading(true);

      try {
        if (selectedTags.length === 0) {
          const apiEvents = await eventSearch(keyword, accessToken, targetPage, PAGE_SIZE);
          console.log('🔍 eventSearch API 응답:', apiEvents);
          // API 응답을 기존 구조로 변환
          const newEvents = apiEvents.map((event: any) => ({
            eventId: event.eventId,
            title: event.title || '',
            content: event.content,
            thumbImage: event.thumbImage || '',
            location: event.location || '',
            likes: event.likes,
            views: event.views,
            startDate: event.startDate,
            endDate: event.endDate,
            isAuthor: event.isAuthor,
            liked: event.liked,
            region: event.region || '',
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
            thumbImage: event.thumbImage || '',
            location: event.location || '',
            likes: event.likes,
            views: event.views,
            startDate: event.startDate,
            endDate: event.endDate,
            isAuthor: event.isAuthor,
            liked: event.liked,
            region: event.region || '',
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

  // 태그 변경 시에만 자동 검색 (키워드 변경 시에는 자동 검색 안 함)
  useEffect(() => {
    if (!isInitialized || !pathname) return;
    localStorage.setItem('selectedTags', JSON.stringify(selectedTags));
    localStorage.setItem('selectedTags_path', pathname);

    // 태그가 선택된 경우에만 자동 검색
    if (selectedTags.length > 0) {
      setEvents([]);
      setPage(1);
      setHasMore(true);
      fetchSearchEvents(1);
    }
  }, [selectedTags, pathname, isInitialized, fetchSearchEvents]);

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

  const clearDateFilter = () => {
    setSelectedDateRange(null);

    // 날짜 필터 초기화 후 다시 검색
    if (keyword.trim() || selectedTags.length > 0) {
      console.log('🔍 날짜 필터 초기화 후 재검색');
      setEvents([]);
      setPage(1);
      setHasMore(true);
      setLoading(true);

      // 날짜 없이 검색
      const searchWithoutDate = async () => {
        try {
          if (selectedTags.length === 0) {
            const apiEvents = await eventSearch(
              keyword,
              accessToken,
              1,
              PAGE_SIZE,
              // 날짜 파라미터 제거
            );
            console.log('🔍 날짜 필터 제거 후 API 응답:', apiEvents);
            const newEvents = apiEvents.map((event: any) => ({
              eventId: event.eventId,
              title: event.title || '',
              content: event.content,
              thumbImage: event.thumbImage,
              location: event.location,
              likes: event.likes,
              views: event.views,
              startDate: event.startDate,
              endDate: event.endDate,
              isAuthor: event.isAuthor,
              liked: event.liked,
              region: event.region || '',
            }));
            setEvents(newEvents);
            setHasMore(newEvents.length === PAGE_SIZE);
          }
        } catch (error) {
          console.error('🔍 날짜 필터 제거 후 검색 실패:', error);
        } finally {
          setLoading(false);
        }
      };

      searchWithoutDate();
    }
  };

  const handleRecentTermClick = (term: string) => {
    console.log('🔍 최근 검색어 클릭됨:', term);

    // URL 업데이트
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', term);
    router.replace(`${pathname}?${params.toString()}`);

    // 바로 검색 실행
    setTimeout(() => {
      setEvents([]);
      setPage(1);
      setHasMore(true);
      fetchSearchEvents(1);
    }, 100); // URL 업데이트 후 잠시 대기
  };

  const handleSearchSubmit = (searchQuery?: string, dateRange?: { startDate: string; endDate: string }) => {
    // BoardSearchHeader에서 전달받은 검색어 또는 현재 URL의 키워드 사용
    const currentKeyword = searchQuery || keyword;

    // 날짜 범위 상태 업데이트
    if (dateRange) {
      setSelectedDateRange(dateRange);
    }

    console.log('🔍 검색 버튼 클릭됨:', { currentKeyword: currentKeyword.trim(), selectedTags, dateRange });

    // URL 업데이트 (검색 버튼을 눌렀을 때만)
    if (searchQuery) {
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery.trim()) {
        params.set('q', searchQuery);
      } else {
        params.delete('q');
      }
      router.replace(`${pathname}?${params.toString()}`);
    }

    // 키워드가 있거나 태그가 선택된 경우에만 검색 (URL 업데이트와 동시에 진행)
    if (currentKeyword.trim() || selectedTags.length > 0) {
      console.log('🔍 검색 조건 충족, 검색 시작');
      setLoading(true);
      setEvents([]);
      setPage(1);
      setHasMore(true);

      // currentKeyword를 직접 사용해서 검색 (URL 업데이트 기다리지 않음)
      const searchWithKeyword = async () => {
        try {
          if (selectedTags.length === 0) {
            const apiEvents = await eventSearch(
              currentKeyword,
              accessToken,
              1,
              PAGE_SIZE,
              dateRange?.startDate,
              dateRange?.endDate,
            );
            console.log('🔍 eventSearch API 응답:', apiEvents);
            const newEvents = apiEvents.map((event: any) => ({
              eventId: event.eventId,
              title: event.title || '',
              content: event.content,
              thumbImage: event.thumbImage,
              liked: event.liked,
              location: event.location,
              likes: event.likes,
              views: event.views,
              startDate: event.startDate,
              endDate: event.endDate,
              receiveAccompany: event.receiveAccompany,
              region: event.region,
              isFreeEntrance: event.isFreeEntrance,
              isAttending: event.isAttending,
              isAuthor: event.isAuthor,
            }));
            setEvents(newEvents);
            setHasMore(newEvents.length === PAGE_SIZE);
          }
        } catch (error) {
          console.error('🔍 검색 실패:', error);
        } finally {
          setLoading(false);
        }
      };

      searchWithKeyword();
    } else {
      console.log('🔍 검색 조건 없음, 결과 초기화');
      // 검색어도 없고 태그도 없으면 결과 초기화
      setEvents([]);
      setHasMore(false);
    }
  };

  return (
    <main className="bg-BG-black text-white">
      <BoardSearchHeader placeholder="검색어를 입력해주세요" onSearchSubmit={handleSearchSubmit} isEvent={true} />

      {keyword === '' && <BoardRecentTerm isEvent={true} onTermClick={handleRecentTermClick} />}

      {/* 필터 UI - 검색 결과가 있을 때만 표시 */}
      {keyword !== '' && (
        <div>
          {/* LocationFilter 컴포넌트에 날짜 라벨 prop 전달 */}
          <LocationFilter
            isEvent={true}
            dateLabel={
              selectedDateRange
                ? {
                    startDate: selectedDateRange.startDate,
                    endDate: selectedDateRange.endDate,
                    onClear: clearDateFilter,
                  }
                : undefined
            }
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-5 gap-y-1 px-5">
        {events.map((event, i) => {
          if (i === events.length - 1) {
            return (
              <div ref={lastEventRef} key={event.eventId}>
                <EventCard event={event} accessToken={accessToken} />
              </div>
            );
          } else {
            return <EventCard key={event.eventId} event={event} accessToken={accessToken} />;
          }
        })}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-main border-t-transparent"></div>
        </div>
      )}

      {!loading && events.length === 0 && keyword !== '' && (
        <NoResults text="조건에 맞는 검색 결과가 없어요" fullHeight={true} />
      )}
    </main>
  );
}
