import React, { useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Club } from '@/lib/types';

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

interface MyEventVenuesProps {
  clubs: EventClub[];
  likedClubs: { [key: number]: boolean };
  heartbeatNums: { [key: number]: number };
  handleHeartClickWrapper: (e: React.MouseEvent, venueId: number) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

// 디데이 계산 함수 (시작날짜 기준)
function calculateDday(startDate: string, endDate: string) {
  const today = new Date();
  const start = new Date(startDate);
  const diff = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : null;
}

// 날짜 형식을 YYYY-MM-DD 형식으로 변환하는 함수
function formatDate(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

// 날짜 범위를 YYYY-MM-DD ~ YYYY-MM-DD 형식으로 변환하는 함수
function formatDateRange(startDate: string, endDate: string) {
  const formattedStart = formatDate(startDate);
  const formattedEnd = formatDate(endDate);
  return `${formattedStart} ~ ${formattedEnd}`;
}

// region의 언더스코어를 띄어쓰기로 변환하고 클라이언트 친화적으로 포맷팅하는 함수
function formatRegion(region: string) {
  // 기본적으로 언더스코어를 띄어쓰기로 변환
  let formatted = region.replace(/_/g, ' ');

  // 특정 지역명에 대한 클라이언트 친화적 포맷팅
  const regionMappings: { [key: string]: string } = {
    압구정로데오: '압구정로데오',
    '강남.신사': '강남 · 신사',
    '강남 신사': '강남 · 신사',
    홍대: '홍대',
    이태원: '이태원',
    뮤직: '뮤직',
    자유: '자유',
    '번개 모임': '번개 모임',
    International: 'International',
    '19+': '19+',
    LGBTQ: 'LGBTQ',
    '짤.밈': '짤 · 밈',
  };

  // 매핑된 지역명이 있으면 해당 포맷 사용
  for (const [key, value] of Object.entries(regionMappings)) {
    if (formatted.includes(key)) {
      formatted = formatted.replace(key, value);
      break;
    }
  }

  return formatted;
}

const MyEventVenues = ({
  clubs,
  likedClubs,
  heartbeatNums,
  handleHeartClickWrapper,
  onLoadMore,
  hasMore = false,
  loading = false,
}: MyEventVenuesProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // 무한스크롤 콜백
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !loading && hasMore && onLoadMore) {
        onLoadMore();
      }
    },
    [loading, hasMore, onLoadMore],
  );

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

  return (
    <div className="grid grid-cols-2 gap-4 p-5">
      {clubs.map((club) => {
        const dday = calculateDday(club.startDate, club.endDate);
        const isEnded = dday === null;

        return (
          <Link key={club.eventId} href={`/event/${club.eventId}`}>
            <div className="overflow-hidden rounded-[0.5rem]">
              <div className="relative aspect-square w-full">
                <Image
                  src={club.thumbImage || '/images/DefaultImage.png'}
                  alt={club.koreanName}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
                  className="rounded-[0.75rem] object-cover"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/80 to-transparent" />

                {/* 끝난 이벤트 그라디언트 오버레이 */}
                {isEnded && <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-black/60 to-black/40" />}

                {/* 좋아요 버튼 */}
                <div
                  onClick={(e) => handleHeartClickWrapper(e, club.eventId)}
                  className="absolute bottom-[0.62rem] right-[0.62rem] z-10 cursor-pointer">
                  <Image
                    src={likedClubs[club.eventId] ? '/icons/FilledHeart.svg' : '/icons/grayHeart.svg'}
                    alt="heart"
                    width={27}
                    height={24}
                  />
                </div>

                {/* 디데이 */}
                {typeof dday === 'number' && (
                  <div
                    className={`absolute left-[0.62rem] top-[0.62rem] z-10 rounded-[0.5rem] px-[0.38rem] pb-[0.16rem] pt-[0.09rem] text-body3-12-medium ${
                      dday <= 7 && dday > 0
                        ? 'bg-main text-white'
                        : dday === 0
                          ? 'bg-FooterBlack text-main'
                          : 'bg-gray500 text-main2'
                    }`}>
                    {dday === 0 ? 'D-DAY' : `D-${dday}`}
                  </div>
                )}

                {/* 좋아요 수 */}
                <div className="absolute bottom-[0.62rem] left-[0.62rem] z-10 flex items-center space-x-1">
                  <Image src="/icons/HeatBeatNumber.svg" alt="pink-heart" width={20} height={20} />
                  <span className="text-body3-12-medium text-gray300">
                    {String(heartbeatNums[club.eventId] || 0).padStart(3, '0')}
                  </span>
                </div>
              </div>

              <div className="relative pb-5 pt-3 text-white">
                <h3 className="truncate text-body-14-bold">{club.title}</h3>
                <p className="text-body-10-medium text-gray100">
                  {club.startDate && club.endDate ? formatDateRange(club.startDate, club.endDate) : ''}
                </p>
                <div className="mt-[0.38rem] inline-block rounded-[0.5rem] bg-gray700 px-[0.5rem] pb-[0.25rem] pt-[0.19rem] text-body-11-medium text-gray300">
                  {club.region ? formatRegion(club.region) : ''}
                </div>
              </div>
            </div>
          </Link>
        );
      })}

      {/* 무한스크롤 로딩 인디케이터 */}
      {hasMore && (
        <div ref={loadingRef} className="col-span-2 flex justify-center py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray300 border-t-main"></div>
        </div>
      )}
    </div>
  );
};

export default MyEventVenues;
