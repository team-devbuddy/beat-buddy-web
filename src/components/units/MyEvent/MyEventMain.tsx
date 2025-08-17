'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect, useMemo } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { accessTokenState, likedClubsState, heartbeatNumsState } from '@/context/recoil-context';
import { getMyEvents } from '@/lib/actions/event-controller/getMyEvents';
import { postEventLike } from '@/lib/actions/venue-controller/postEventLike';
import { deleteEventLike } from '@/lib/actions/venue-controller/deleteEventLike';
import { Club } from '@/lib/types';
import MyEventVenues from './MyEventVenues';
import MyHeartBeatSkeleton from '@/components/common/skeleton/MyHeartBeatSkeleton';
import NoResults from '../Search/NoResult';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { userProfileState } from '@/context/recoil-context';
const MyEventHeader = dynamic(() => import('./MyEventHeader'), { ssr: false });

type TabType = 'attending' | 'liked';

// 이벤트 카드용 확장된 Club 타입
interface EventClub extends Club {
  startDate?: string;
  endDate?: string;
  eventId?: number;
  liked?: boolean;
  views?: number;
  isAttending?: boolean;
  isAuthor?: boolean;
  isFreeEntrance?: boolean;
}

// 지역 필터링 관련 상수
const regionMap = {
  이태원: '이태원',
  홍대: '홍대',
  '압구정 로데오': '압구정.로데오',
  '강남 신사': '강남.신사',
  기타: '기타',
};
const regionLabels = Object.keys(regionMap);

// 디데이 계산 함수
function getDdayLabel(endDate: string) {
  const today = new Date();
  const end = new Date(endDate);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : null;
}

export default function MyEventMain({ type = 'upcoming' }: { type?: 'upcoming' | 'past' | 'my-event' }) {
  // --- Recoil State ---
  const accessToken = useRecoilValue(accessTokenState);
  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);
  const userProfile = useRecoilValue(userProfileState);
  // --- Component State ---
  const [allMyEvents, setAllMyEvents] = useState<EventClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('attending');

  // --- 무한스크롤 상태 ---
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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

  // ❗ 1. 데이터 가져오기 로직 단순화
  useEffect(() => {
    const fetchMyEvents = async () => {
      if (!accessToken) {
        setLoading(false);
        console.error('Access token is not available');
        return;
      }

      setLoading(true);
      setPage(1);
      setHasMore(true);
      try {
        // type prop에 따라 다른 API 호출
        const response = await getMyEvents(accessToken, type, 1, 10);
        const eventData = response.eventResponseDTOS || [];

        // API 응답을 Club 타입으로 한번만 매핑합니다.
        const allClubs: EventClub[] = eventData.map((event: any) => ({
          id: event.eventId,
          venueId: event.eventId,
          englishName: event.title,
          koreanName: event.title,
          address: event.location,
          isHeartbeat: event.liked,
          heartbeatNum: event.likes,
          logoUrl: event.thumbImage,
          backgroundUrl: event.thumbImage ? [event.thumbImage] : [],
          // --- 아래는 API에 없는 기본값 ---
          region: event.region || '',
          description: event.content || '',
          entranceFee: 0,
          entranceNotice: '',
          tagList: [],
          createdAt: '',
          updatedAt: '',
          instaId: '',
          instaUrl: '',
          operationHours: {},
          smokingAllowed: false,
          // --- 이벤트 전용 필드 추가 ---
          startDate: event.startDate,
          endDate: event.endDate,
          eventId: event.eventId,
          liked: event.liked,
          views: event.views,
          isAttending: event.isAttending,
          isAuthor: event.isAuthor,
          isFreeEntrance: event.isFreeEntrance,
        }));

        setAllMyEvents(allClubs);

        // 더 불러올 데이터가 있는지 확인
        setHasMore(eventData.length === 10);

        // Recoil 상태를 업데이트합니다.
        const likedStatuses = allClubs.reduce(
          (acc, club) => {
            acc[club.id] = club.isHeartbeat;
            return acc;
          },
          {} as { [key: number]: boolean },
        );
        setLikedClubs(likedStatuses);

        const heartbeatNumbers = allClubs.reduce(
          (acc, club) => {
            acc[club.id] = club.heartbeatNum;
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
    };

    fetchMyEvents();
  }, [accessToken, setLikedClubs, setHeartbeatNums, type]);

  // ❗ 무한스크롤 로드 더 많은 데이터
  const loadMore = async () => {
    if (!hasMore || isLoadingMore || !accessToken) return;

    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const response = await getMyEvents(accessToken, type, nextPage, 10);
      const eventData = response.eventResponseDTOS || [];

      if (eventData.length === 0) {
        setHasMore(false);
        return;
      }

      const newClubs: EventClub[] = eventData.map((event: any) => ({
        id: event.eventId,
        venueId: event.eventId,
        englishName: event.title,
        koreanName: event.title,
        address: event.location,
        isHeartbeat: event.liked,
        heartbeatNum: event.likes,
        logoUrl: event.thumbImage,
        backgroundUrl: event.thumbImage ? [event.thumbImage] : [],
        region: event.region || '',
        description: event.content || '',
        entranceFee: 0,
        entranceNotice: '',
        tagList: [],
        createdAt: '',
        updatedAt: '',
        instaId: '',
        instaUrl: '',
        operationHours: {},
        smokingAllowed: false,
        startDate: event.startDate,
        endDate: event.endDate,
        eventId: event.eventId,
        liked: event.liked,
        views: event.views,
        isAttending: event.isAttending,
        isAuthor: event.isAuthor,
        isFreeEntrance: event.isFreeEntrance,
      }));

      setAllMyEvents((prev) => [...prev, ...newClubs]);
      setPage(nextPage);
      setHasMore(eventData.length === 10);

      // Recoil 상태 업데이트
      const newLikedStatuses = newClubs.reduce(
        (acc, club) => {
          acc[club.id] = club.isHeartbeat;
          return acc;
        },
        {} as { [key: number]: boolean },
      );
      setLikedClubs((prev) => ({ ...prev, ...newLikedStatuses }));

      const newHeartbeatNumbers = newClubs.reduce(
        (acc, club) => {
          acc[club.id] = club.heartbeatNum;
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
  };

  // ❗ 2. '참석'과 '좋아요' 목록을 useMemo로 계산 (성능 최적화)
  const attendingClubs = useMemo(() => allMyEvents, [allMyEvents]);

  const likedClubsList = useMemo(() => {
    // 좋아요 상태는 실시간으로 변할 수 있으므로, Recoil의 likedClubs 상태를 기준으로 필터링
    return allMyEvents.filter((club) => likedClubs[club.id]);
  }, [allMyEvents, likedClubs]);

  // ❗ 3. 지역 필터링 로직
  const filteredClubs = useMemo(() => {
    // past 타입이나 my-event 타입일 때는 모든 이벤트를 표시
    const currentClubs =
      type === 'past' || type === 'my-event'
        ? allMyEvents
        : activeTab === 'attending'
          ? attendingClubs
          : likedClubsList;

    if (selectedRegions.length === 0) {
      return currentClubs;
    }

    return currentClubs.filter((club) => {
      const clubRegion = club.region;
      return selectedRegions.some((selectedRegion) => {
        const serverRegion = regionMap[selectedRegion as keyof typeof regionMap];
        return clubRegion === serverRegion;
      });
    });
  }, [type, activeTab, attendingClubs, likedClubsList, allMyEvents, selectedRegions]);

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
    return <MyHeartBeatSkeleton />;
  }

  return (
    <div className="flex w-full flex-col">
      <div className="flex-grow bg-BG-black">
        <MyEventHeader type={type} />

        {/* 탭바 - upcoming 타입일 때만 표시 */}
        {userProfile?.role !== 'BUSINESS' && userProfile?.role !== 'ADMIN' && (
          <div
            className="relative flex border-b border-gray700"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ touchAction: isSwiping ? 'none' : 'auto' }}>
            <button
              onClick={() => setActiveTab('attending')}
              className={`flex-1 py-4 text-center text-[0.875rem] font-medium transition-colors ${
                activeTab === 'attending' ? 'font-bold text-main' : 'text-gray300'
              }`}>
              참석 명단 작성한
            </button>
            <button
              onClick={() => setActiveTab('liked')}
              className={`flex-1 py-4 text-center text-[0.875rem] font-medium transition-colors ${
                activeTab === 'liked' ? 'font-bold text-main' : 'text-gray300'
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
        )}

        {/* 지역 필터 */}
        <div className="w-full px-5 pt-5">
          {/* 상단 필터 헤더 */}
          <div className="flex items-center justify-between">
            <button
              className={`rounded-[0.5rem] px-[0.62rem] py-[0.25rem] text-[0.875rem] focus:outline-none ${
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
                      className={`rounded-[0.38rem] px-[0.63rem] py-[0.25rem] text-[0.875rem] focus:outline-none ${
                        isSelected ? 'bg-sub2 text-main' : 'bg-gray700 text-gray400'
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
          {clubsToRender.length > 0 ? (
            <MyEventVenues
              clubs={clubsToRender}
              likedClubs={likedClubs}
              heartbeatNums={heartbeatNums}
              handleHeartClickWrapper={handleEventClickWrapper}
              onLoadMore={loadMore}
              hasMore={hasMore}
              loading={isLoadingMore}
            />
          ) : (
            <NoResults
              text={
                type === 'past'
                  ? '과거 이벤트가 없어요!'
                  : type === 'my-event'
                    ? '내가 작성한 이벤트가 없어요!'
                    : activeTab === 'attending'
                      ? '아직 참석 등록한 이벤트가 없어요'
                      : '마음에 들어한 이벤트가 없어요'
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
