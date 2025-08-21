'use client';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { accessTokenState, likedClubsState, heartbeatNumsState } from '@/context/recoil-context';
import { getMyPageEvents } from '@/lib/actions/event-controller/getMyPageEvents';
import { getMyLikedEvents } from '@/lib/actions/event-controller/getMyLikedEvents';
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

type TabType = 'attending' | 'liked';
type EventType = 'upcoming' | 'past' | 'my-event';

// 이벤트 카드용 확장된 Club 타입
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

interface MyEventMainProps {
  type?: EventType;
}

export default function MyEventMain({ type = 'upcoming' }: MyEventMainProps) {
  // --- Recoil State ---
  const accessToken = useRecoilValue(accessTokenState);
  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);
  const userProfile = useRecoilValue(userProfileState);
  const router = useRouter();
  // --- Component State ---
  const [attendingEvents, setAttendingEvents] = useState<EventClub[]>([]);
  const [likedEvents, setLikedEvents] = useState<EventClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('attending');

  // --- 무한스크롤 상태 ---
  const [attendingPage, setAttendingPage] = useState(1);
  const [likedPage, setLikedPage] = useState(1);
  const [attendingHasMore, setAttendingHasMore] = useState(true);
  const [likedHasMore, setLikedHasMore] = useState(true);
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
        if (activeTab === 'attending') {
          setActiveTab('liked');
        }
      } else {
        // 오른쪽으로 스와이프 - 이전 탭으로
        if (activeTab === 'liked') {
          setActiveTab('attending');
        }
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
    setIsSwiping(false);
  };

  // ❗ 무한스크롤 로드 더 많은 데이터
  const loadMore = useCallback(async () => {
    const currentHasMore = activeTab === 'attending' ? attendingHasMore : likedHasMore;
    const currentPage = activeTab === 'attending' ? attendingPage : likedPage;

    if (!currentHasMore || isLoadingMore || !accessToken) return;

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const region = selectedRegions.length > 0 ? selectedRegions[0] : undefined;

      // UI label을 serverRegion으로 변환
      const serverRegion = region ? regionMap[region as keyof typeof regionMap] : undefined;

      let response;
      let eventData;

      if (activeTab === 'attending') {
        // 참석 이벤트는 getMyPageEvents 사용
        response = await getMyPageEvents(accessToken, 'attendance', nextPage, 10, serverRegion);
        eventData = response.data?.eventResponseDTOS || [];
      } else {
        // 좋아요 이벤트는 getMyLikedEvents 사용
        response = await getMyLikedEvents(accessToken, nextPage, 10, serverRegion);
        eventData = response?.data?.eventResponseDTOS || response || [];
      }

      if (activeTab === 'attending') {
        setAttendingEvents((prev) =>
          Array.isArray(prev) && Array.isArray(eventData)
            ? [...prev, ...eventData]
            : Array.isArray(eventData)
              ? eventData
              : [],
        );
        setAttendingPage(nextPage);
        setAttendingHasMore(Array.isArray(eventData) ? eventData.length === 10 : false);
      } else {
        setLikedEvents((prev) =>
          Array.isArray(prev) && Array.isArray(eventData)
            ? [...prev, ...eventData]
            : Array.isArray(eventData)
              ? eventData
              : [],
        );
        setLikedPage(nextPage);
        setLikedHasMore(Array.isArray(eventData) ? eventData.length === 10 : false);
      }

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
    attendingHasMore,
    likedHasMore,
    attendingPage,
    likedPage,
    isLoadingMore,
    accessToken,
    setLikedClubs,
    setHeartbeatNums,
    selectedRegions,
  ]);

  // ❗ 1. 데이터 가져오기 로직 단순화
  const fetchMyEvents = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    console.log('🔍 fetchMyEvents 호출:', {
      activeTab,
      selectedRegions,
      selectedRegionsLength: selectedRegions.length,
    });

    setLoading(true);
    if (activeTab === 'attending') {
      setAttendingPage(1);
      setAttendingHasMore(true);
      setAttendingEvents([]);
    } else {
      setLikedPage(1);
      setLikedHasMore(true);
      setLikedEvents([]);
    }

    try {
      // 지역 필터가 없으면 undefined, 있으면 첫 번째 지역 사용
      const region = selectedRegions.length > 0 ? selectedRegions[0] : undefined;

      // UI label을 serverRegion으로 변환
      const serverRegion = region ? regionMap[region as keyof typeof regionMap] : undefined;

      console.log('🔍 API 호출 파라미터:', {
        region,
        serverRegion,
        selectedRegions,
        activeTab,
      });

      let response;
      let eventData;

      if (activeTab === 'attending') {
        // 참석 이벤트는 getMyPageEvents 사용
        response = await getMyPageEvents(accessToken, 'attendance', 1, 10, serverRegion);
        eventData = response.data?.eventResponseDTOS || [];
      } else {
        // 좋아요 이벤트는 getMyLikedEvents 사용
        response = await getMyLikedEvents(accessToken, 1, 10, serverRegion);
        eventData = response?.data?.eventResponseDTOS || response || [];
      }

      console.log('🔍 API 응답:', {
        response,
        eventData,
        eventDataLength: Array.isArray(eventData) ? eventData.length : 'not array',
      });

      if (activeTab === 'attending') {
        setAttendingEvents(Array.isArray(eventData) ? eventData : []);
        setAttendingHasMore(Array.isArray(eventData) ? eventData.length === 10 : false);
      } else {
        setLikedEvents(Array.isArray(eventData) ? eventData : []);
        setLikedHasMore(Array.isArray(eventData) ? eventData.length === 10 : false);
      }

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

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  // selectedRegions 변경 감지용 useEffect 추가
  useEffect(() => {
    console.log('🔍 selectedRegions 변경 감지:', {
      selectedRegions,
      length: selectedRegions.length,
      willCallAPI: true,
    });

    // selectedRegions가 변경될 때마다 API 호출
    if (accessToken) {
      console.log('🔍 selectedRegions 변경으로 인한 API 호출');
      // fetchMyEvents를 직접 호출 (중복 방지)
      fetchMyEvents();
    }
  }, [selectedRegions, accessToken, fetchMyEvents]);

  // IntersectionObserver를 사용한 무한스크롤
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const currentHasMore = activeTab === 'attending' ? attendingHasMore : likedHasMore;
        if (entries[0].isIntersecting && currentHasMore && !isLoadingMore) {
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
  }, [loadMore, activeTab, attendingHasMore, likedHasMore, isLoadingMore]);

  // ❗ 2. '참석'과 '좋아요' 목록을 useMemo로 계산 (성능 최적화)
  const attendingClubs = useMemo(() => {
    return Array.isArray(attendingEvents) ? attendingEvents : [];
  }, [attendingEvents]);

  const likedClubsList = useMemo(() => {
    // getMyLikedEvents를 사용하므로 모든 데이터가 이미 좋아요한 이벤트
    console.log('likedEvents:', likedEvents);
    return Array.isArray(likedEvents) ? likedEvents : [];
  }, [likedEvents]);

  // ❗ 3. 지역 필터링 및 정렬 로직
  const filteredClubs = useMemo(() => {
    // 일반회원용: 탭에 따라 이벤트 필터링
    const currentClubs = activeTab === 'attending' ? attendingClubs : likedClubsList;

    let filtered = currentClubs;

    // 지역 필터링
    if (selectedRegions.length > 0) {
      filtered = currentClubs.filter((club) => {
        const clubRegion = club.region;
        return selectedRegions.some((selectedRegion) => {
          const serverRegion = regionMap[selectedRegion as keyof typeof regionMap];
          return clubRegion === serverRegion;
        });
      });
    }

    // 디데이 기준으로 정렬 (NewsContents와 동일)
    return sortEventsByDday(filtered);
  }, [activeTab, attendingClubs, likedClubsList, selectedRegions, attendingEvents, likedEvents]);

  // ❗ 이벤트 좋아요 클릭 핸들러 (낙관적 업데이트)
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

    const isCurrentlyLiked = likedClubs[eventId];
    const currentLikes = heartbeatNums[eventId] || 0;

    // 낙관적 업데이트: 즉시 UI 반영
    if (isCurrentlyLiked) {
      // 좋아요 취소
      setLikedClubs({ ...likedClubs, [eventId]: false });
      setHeartbeatNums((prev) => ({
        ...prev,
        [eventId]: Math.max(0, currentLikes - 1),
      }));
    } else {
      // 좋아요 추가
      setLikedClubs({ ...likedClubs, [eventId]: true });
      setHeartbeatNums((prev) => ({
        ...prev,
        [eventId]: currentLikes + 1,
      }));
    }

    try {
      if (isCurrentlyLiked) {
        // 좋아요 취소 API 호출
        await deleteEventLike(eventId, accessToken);
      } else {
        // 좋아요 추가 API 호출
        await postEventLike(eventId, accessToken);
      }
    } catch (error) {
      console.error('Error toggling event like:', error);

      // API 실패 시 원래 상태로 롤백
      if (isCurrentlyLiked) {
        setLikedClubs({ ...likedClubs, [eventId]: true });
        setHeartbeatNums((prev) => ({
          ...prev,
          [eventId]: currentLikes,
        }));
      } else {
        setLikedClubs({ ...likedClubs, [eventId]: false });
        setHeartbeatNums((prev) => ({
          ...prev,
          [eventId]: currentLikes,
        }));
      }
    }
  };

  const handleEventClickWrapper = async (e: React.MouseEvent, venueId: number) => {
    await handleEventClick(e, venueId, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex w-full flex-col">
      <div className="flex-grow bg-BG-black">
        <header className="flex flex-col bg-BG-black px-[1.25rem]">
          <div className="flex w-full items-center py-[0.62rem]">
            <div onClick={() => router.push('/mypage')} className="flex items-start">
              <Image src="/icons/arrow_back_ios.svg" alt="뒤로가기" width={24} height={24} />
            </div>
            <div className="flex w-full items-center justify-between">
              <span className="text-subtitle-20-bold text-white">
                {type === 'upcoming' ? 'My Events' : type === 'past' ? '지난 이벤트' : '내 이벤트'}
              </span>
            </div>
          </div>
        </header>
        {/* 탭바 */}
        <div
          className="relative flex"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{ touchAction: isSwiping ? 'none' : 'auto' }}>
          <button
            onClick={() => setActiveTab('attending')}
            className={`flex-1 py-3 text-center text-body-14-medium font-medium transition-colors ${
              activeTab === 'attending' ? 'font-bold text-main' : 'text-gray100'
            }`}>
            {type === 'upcoming' ? '참석 명단 작성한' : type === 'past' ? '지난' : '참석 명단 작성한'}
          </button>
          <button
            onClick={() => setActiveTab('liked')}
            className={`flex-1 py-3 text-center text-body-14-medium font-medium transition-colors ${
              activeTab === 'liked' ? 'font-bold text-main' : 'text-gray100'
            }`}>
            마음에 들어한
          </button>

          {/* 밑줄 애니메이션 */}
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute bottom-0 h-[2px] w-1/2 bg-main"
            style={{
              left: activeTab === 'attending' ? '0%' : '50%',
            }}
          />
        </div>

        {/* 지역 필터 */}
        <div className="w-full px-5 pt-5">
          {/* 상단 필터 헤더 */}
          <div className="flex items-center justify-between">
            <button
              className={`rounded-[0.5rem] px-[0.62rem] py-[0.25rem] text-body-14-medium transition-colors focus:outline-none ${
                selectedRegions.length > 0 ? 'bg-sub2 font-medium text-main' : 'bg-gray700 text-gray300'
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
                        console.log('🔍 지역 필터 클릭 전 상태:', {
                          label,
                          currentSelected: selectedRegions,
                          isSelected,
                          selectedRegionsLength: selectedRegions.length,
                        });

                        setSelectedRegions((prev) => {
                          console.log('🔍 setSelectedRegions 내부 - prev:', prev);

                          if (!Array.isArray(prev)) {
                            console.log('🔍 prev가 배열이 아님, 새로 생성');
                            return [label];
                          }

                          let newRegions;
                          if (prev.includes(label)) {
                            // 이미 선택된 지역이면 해제
                            newRegions = prev.filter((r) => r !== label);
                            console.log('🔍 지역 해제:', { label, prev, newRegions });
                          } else {
                            // 선택되지 않은 지역이면 추가
                            newRegions = [...prev, label];
                            console.log('🔍 지역 추가:', { label, prev, newRegions });
                          }

                          console.log('🔍 지역 필터 변경 완료:', {
                            prev,
                            newRegions,
                            label,
                            action: prev.includes(label) ? '해제' : '추가',
                            newRegionsLength: newRegions.length,
                          });

                          return newRegions;
                        });
                      }}
                      whileTap={{ scale: 1.1 }}
                      className={`rounded-[0.38rem] px-[0.63rem] py-[0.25rem] text-body-14-medium transition-colors focus:outline-none ${
                        isSelected ? 'bg-sub2 font-medium text-main' : 'bg-gray700 text-gray300'
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
                    hasMore={activeTab === 'attending' ? attendingHasMore : likedHasMore}
                    loading={isLoadingMore}
                  />
                ) : (
                  <NoResults
                    text={
                      activeTab === 'attending'
                        ? type === 'upcoming'
                          ? '아직 참석 등록한 이벤트가 없어요'
                          : type === 'past'
                            ? '지난 이벤트가 없어요'
                            : '아직 참석 등록한 이벤트가 없어요'
                        : '마음에 들어한 이벤트가 없어요'
                    }
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 무한스크롤 감지 요소 */}
          {(activeTab === 'attending' ? attendingHasMore : likedHasMore) && (
            <div ref={observerRef} className="h-4 w-full" style={{ minHeight: '1rem' }} />
          )}
        </div>
      </div>
    </div>
  );
}
