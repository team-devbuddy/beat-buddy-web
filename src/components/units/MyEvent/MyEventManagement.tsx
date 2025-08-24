'use client';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { accessTokenState, likedClubsState, heartbeatNumsState } from '@/context/recoil-context';
import { getMyEventUpcoming } from '@/lib/actions/event-controller/getMyEventUpcoming';
import { getMyEventPast } from '@/lib/actions/event-controller/getMyEventPast';
import { postEventLike } from '@/lib/actions/venue-controller/postEventLike';
import { deleteEventLike } from '@/lib/actions/venue-controller/deleteEventLike';
import { Club } from '@/lib/types';
import MyEventVenues from './MyEventVenues';
import NoResults from '../Search/NoResult';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { userProfileState } from '@/context/recoil-context';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';

type TabType = 'upcoming' | 'past';

// 이벤트 카드용 확장된 Club 타입 (MyEventMain과 동일)
interface EventClub extends Club {
  eventId: number;
  title: string;
  content: string;
  thumbImage: string;
  liked: boolean;
  location: string;
  likes: number;
  views: number;
  startDate: string;
  endDate: string;
  receiveAccompany: boolean;
  region: string;
  isFreeEntrance: boolean;
  isAttending: boolean;
  isAuthor: boolean;
}

// 지역 필터링 관련 상수
const regionMap = {
  이태원: '이태원',
  홍대: '홍대',
  압구정로데오: '압구정_로데오',
  '강남 · 신사': '강남_신사',
  기타: '기타',
};
const regionLabels = Object.keys(regionMap);

// 디데이 계산 함수 (시작날짜 기준)
function calculateDday(startDate: string, endDate: string) {
  const today = new Date();
  const start = new Date(startDate);
  const diff = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : null;
}

// 이벤트 정렬 함수 (D-DAY 우선, 가까운 순)
const sortEventsByDday = (events: EventClub[]) => {
  return [...events].sort((a, b) => {
    const aDday = calculateDday(a.startDate, a.endDate);
    const bDday = calculateDday(b.startDate, b.endDate);

    // null(끝난 이벤트)과 진행중인 이벤트 구분
    const aIsEnded = aDday === null;
    const bIsEnded = bDday === null;

    // 진행중인 이벤트를 먼저, 끝난 이벤트를 뒤로
    if (aIsEnded && !bIsEnded) return 1;
    if (!aIsEnded && bIsEnded) return -1;

    // 둘 다 진행중인 경우: D-DAY 우선, 그 다음 가까운 순
    if (!aIsEnded && !bIsEnded) {
      // D-DAY(0)가 가장 먼저
      if (aDday === 0 && bDday !== 0) return -1;
      if (bDday === 0 && aDday !== 0) return 1;

      // 그 다음 가까운 순 (낮은 숫자가 먼저)
      if (aDday !== bDday) {
        return aDday - bDday;
      }

      // D-day가 같으면 좋아요 수로 정렬 (높은 순)
      return (b.likes || 0) - (a.likes || 0);
    }

    // 둘 다 끝난 경우: 좋아요 수로 정렬 (높은 순)
    return (b.likes || 0) - (a.likes || 0);
  });
};

export default function MyEventManagement() {
  // --- Recoil State ---
  const accessToken = useRecoilValue(accessTokenState);
  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);
  const userProfile = useRecoilValue(userProfileState);
  const router = useRouter();

  // --- Component State ---
  const [upcomingEvents, setUpcomingEvents] = useState<EventClub[]>([]);
  const [pastEvents, setPastEvents] = useState<EventClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  // --- 무한스크롤 상태 ---
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const [upcomingHasMore, setUpcomingHasMore] = useState(true);
  const [pastHasMore, setPastHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  // --- 필터링 상태 ---
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  // --- 스와이프 관련 상태 ---
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  // 스와이프 핸들러
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const currentTouch = e.targetTouches[0].clientX;
    const diff = touchStart - currentTouch;

    if (Math.abs(diff) > 10) {
      setIsSwiping(true);
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || !isSwiping) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // 왼쪽으로 스와이프 - 다음 탭으로
        if (activeTab === 'upcoming') {
          setActiveTab('past');
        }
      } else {
        // 오른쪽으로 스와이프 - 이전 탭으로
        if (activeTab === 'past') {
          setActiveTab('upcoming');
        }
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
    setIsSwiping(false);
  };

  // ❗ 1. 데이터 가져오기 로직 (upcoming만)
  const fetchMyEvents = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setUpcomingPage(1);
    setUpcomingHasMore(true);
    setUpcomingEvents([]);

    try {
      const regionParam = selectedRegions.length > 0 ? selectedRegions[0] : undefined;
      const response = await getMyEventUpcoming(accessToken, 1, 10, regionParam);
      const eventData = response.data?.eventResponseDTOS || [];

      setUpcomingEvents(Array.isArray(eventData) ? eventData : []);
      setUpcomingHasMore(Array.isArray(eventData) ? eventData.length === 10 : false);

      // Recoil 상태를 업데이트합니다.
      const likedStatuses = eventData.reduce(
        (acc: { [key: number]: boolean }, club: EventClub) => {
          acc[club.eventId] = club.liked;
          return acc;
        },
        {} as { [key: number]: boolean },
      );
      setLikedClubs(likedStatuses);

      const heartbeatNumbers = eventData.reduce(
        (acc: { [key: number]: number }, club: EventClub) => {
          acc[club.eventId] = club.likes;
          return acc;
        },
        {} as { [key: number]: number },
      );
      setHeartbeatNums(heartbeatNumbers);
    } catch (error) {
      console.error('Error fetching my events:', error);
    } finally {
      setLoading(false);
    }
  }, [accessToken, setLikedClubs, setHeartbeatNums, activeTab, selectedRegions]);

  // ❗ 무한스크롤 로드 더 많은 데이터 (upcoming만)
  const loadMore = useCallback(async () => {
    if (!upcomingHasMore || isLoadingMore || !accessToken) return;

    setIsLoadingMore(true);
    try {
      const nextPage = upcomingPage + 1;
      const regionParam = selectedRegions.length > 0 ? selectedRegions[0] : undefined;
      const response = await getMyEventUpcoming(accessToken, nextPage, 10, regionParam);
      const eventData = response.data?.eventResponseDTOS || [];

      if (eventData.length === 0) {
        setUpcomingHasMore(false);
        return;
      }

      setUpcomingEvents((prev) =>
        Array.isArray(prev) && Array.isArray(eventData)
          ? [...prev, ...eventData]
          : Array.isArray(eventData)
            ? eventData
            : [],
      );
      setUpcomingPage(nextPage);
      setUpcomingHasMore(Array.isArray(eventData) ? eventData.length === 10 : false);

      // Recoil 상태 업데이트
      const newLikedStatuses = eventData.reduce(
        (acc: { [key: number]: boolean }, club: EventClub) => {
          acc[club.eventId] = club.liked;
          return acc;
        },
        {} as { [key: number]: boolean },
      );
      setLikedClubs((prev) => ({ ...prev, ...newLikedStatuses }));

      const newHeartbeatNumbers = eventData.reduce(
        (acc: { [key: number]: number }, club: EventClub) => {
          acc[club.eventId] = club.likes;
          return acc;
        },
        {} as { [key: number]: number },
      );
      setHeartbeatNums((prev) => ({ ...prev, ...newHeartbeatNumbers }));
    } catch (error) {
      console.error('Error loading more events:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    activeTab,
    upcomingHasMore,
    pastHasMore,
    upcomingPage,
    pastPage,
    isLoadingMore,
    accessToken,
    setLikedClubs,
    setHeartbeatNums,
    selectedRegions,
  ]);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  // IntersectionObserver를 사용한 무한스크롤
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && upcomingHasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loadMore, upcomingHasMore, isLoadingMore]);

  // ❗ 2. 이벤트 목록을 useMemo로 계산 (성능 최적화)
  const upcomingClubs = useMemo(() => {
    return Array.isArray(upcomingEvents) ? upcomingEvents : [];
  }, [upcomingEvents]);

  // ❗ 3. 지역 필터링 및 정렬 로직
  const filteredClubs = useMemo(() => {
    let filtered = upcomingClubs;

    // 지역 필터링
    if (selectedRegions.length > 0) {
      filtered = upcomingClubs.filter((club) => {
        const clubRegion = club.region;
        return selectedRegions.some((selectedRegion) => {
          const serverRegion = regionMap[selectedRegion as keyof typeof regionMap];
          return clubRegion === serverRegion;
        });
      });
    }

    // 디데이 기준으로 정렬 (MyEventMain과 동일)
    return sortEventsByDday(filtered);
  }, [upcomingClubs, selectedRegions]);

  // ❗ 이벤트 좋아요 클릭 핸들러
  const handleEventClick = async (
    e: React.MouseEvent,
    eventId: number,
    likedClubs: { [key: number]: boolean },
    setLikedClubs: (value: { [key: number]: boolean }) => void,
    setHeartbeatNums: React.Dispatch<React.SetStateAction<{ [key: number]: number }>>,
    accessToken: string | null,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!accessToken) {
      console.error('Access token is required');
      return;
    }

    try {
      const isCurrentlyLiked = likedClubs[eventId];

      if (isCurrentlyLiked) {
        // 좋아요 취소
        await deleteEventLike(eventId, accessToken);
        setLikedClubs({ ...likedClubs, [eventId]: false });
        setHeartbeatNums((prev) => ({
          ...prev,
          [eventId]: Math.max(0, (prev[eventId] || 0) - 1),
        }));
      } else {
        // 좋아요 추가
        await postEventLike(eventId, accessToken);
        setLikedClubs({ ...likedClubs, [eventId]: true });
        setHeartbeatNums((prev) => ({
          ...prev,
          [eventId]: (prev[eventId] || 0) + 1,
        }));
      }
    } catch (error) {
      console.error('Error toggling event like:', error);
    }
  };

  const handleEventClickWrapper = async (e: React.MouseEvent, venueId: number) => {
    await handleEventClick(e, venueId, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
  };

  // ❗ 4. 렌더링할 목록을 결정하는 로직
  const clubsToRender = filteredClubs;

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex w-full flex-col">
      <div className="flex-grow bg-BG-black">
        <header className="flex flex-col bg-BG-black px-[1.25rem]">
          <div className="flex w-full items-center py-[0.62rem]">
            <div onClick={() => router.back()} className="flex items-center">
              <Image src="/icons/arrow_back_ios.svg" alt="뒤로가기" width={24} height={24} className="cursor-pointer" />
            </div>
            <span className="text-subtitle-20-bold text-white">주최이벤트 관리하기</span>
            <div className="ml-auto">
              <span
                onClick={() => router.push('/myevent/past-manage')}
                className="text-body3-12-medium text-gray300 underline">
                과거 이벤트 보러가기
              </span>
            </div>
          </div>
        </header>

        {/* 지역 필터 */}
        <div className="w-full px-5 pt-5">
          {/* 상단 필터 헤더 */}
          <div className="flex items-center justify-between">
            <button
              className={`rounded-[0.38rem] px-[0.62rem] py-[0.25rem] text-body-14-medium focus:outline-none ${
                selectedRegions.length > 0 ? 'bg-sub2 text-main' : 'bg-gray700 text-gray300'
              }`}
              onClick={() => setShowFilter(!showFilter)}>
              지역
            </button>
          </div>

          {/* 지역 필터 */}
          <AnimatePresence>
            {showFilter && (
              <motion.div
                className="mt-2 flex w-full flex-wrap gap-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}>
                {regionLabels.map((label) => {
                  const serverRegion = regionMap[label as keyof typeof regionMap];
                  const isSelected = selectedRegions.includes(label);

                  return (
                    <motion.button
                      key={label}
                      onClick={() => {
                        setSelectedRegions((prev) =>
                          prev.includes(label) ? prev.filter((r) => r !== label) : [...prev, label],
                        );
                      }}
                      whileTap={{ scale: 1.1 }}
                      className={`rounded-[0.38rem] px-[0.63rem] py-[0.25rem] text-body-14-medium focus:outline-none ${
                        isSelected ? 'bg-sub2 text-main' : 'bg-gray700 text-gray300'
                      }`}
                      transition={{ type: 'spring', stiffness: 300 }}>
                      {label}
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 탭별 컨텐츠 */}
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{ touchAction: isSwiping ? 'none' : 'auto' }}>
          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${selectedRegions.join(',')}`}
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-full">
                {filteredClubs.length > 0 ? (
                  <MyEventVenues
                    clubs={filteredClubs}
                    likedClubs={likedClubs}
                    heartbeatNums={heartbeatNums}
                    handleHeartClickWrapper={handleEventClickWrapper}
                    onLoadMore={loadMore}
                    hasMore={upcomingHasMore}
                    loading={isLoadingMore}
                  />
                ) : (
                  <NoResults text="진행중인 이벤트가 없어요" />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 무한스크롤 감지 요소 */}
          {upcomingHasMore && <div ref={observerRef} className="h-4 w-full" style={{ minHeight: '1rem' }} />}
        </div>
      </div>
    </div>
  );
}
