import React, { useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Club } from '@/lib/types';

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

interface MyEventVenuesProps {
  clubs: EventClub[];
  likedClubs: { [key: number]: boolean };
  heartbeatNums: { [key: number]: number };
  handleHeartClickWrapper: (e: React.MouseEvent, venueId: number) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

// 디데이 계산 함수
function getDdayLabel(endDate: string) {
  const today = new Date();
  const end = new Date(endDate);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : null;
}

// 날짜 형식을 YYYY-MM-DD 형식으로 변환하는 함수
function formatDate(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 날짜 범위를 YYYY-MM-DD ~ YYYY-MM-DD 형식으로 변환하는 함수
function formatDateRange(startDate: string, endDate: string) {
  const formattedStart = formatDate(startDate);
  const formattedEnd = formatDate(endDate);
  return `${formattedStart} ~ ${formattedEnd}`;
}

// region의 언더스코어를 띄어쓰기로 변환하는 함수
function formatRegion(region: string) {
  return region.replace(/_/g, ' ');
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
        const dday = getDdayLabel(club.endDate || '');

        return (
          <Link key={club.id} href={`/event/${club.id}`}>
            <div className="overflow-hidden rounded-[0.5rem]">
              <div className="relative aspect-square w-full">
                <Image
                  src={club.logoUrl || '/images/DefaultImage.png'}
                  alt={club.koreanName}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
                  className="rounded-[0.75rem] object-cover"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/80 to-transparent" />

                {/* 좋아요 버튼 */}
                <div
                  onClick={(e) => handleHeartClickWrapper(e, club.id)}
                  className="absolute bottom-3 right-3 z-10 cursor-pointer">
                  <Image
                    src={likedClubs[club.id] ? '/icons/FilledHeart.svg' : '/icons/GrayHeart.svg'}
                    alt="heart"
                    width={27}
                    height={24}
                  />
                </div>

                {/* 디데이 */}
                {typeof dday === 'number' && (
                  <div
                    className={`absolute left-3 top-3 z-10 rounded-[0.5rem] px-[0.38rem] py-[0.13rem] text-[0.75rem] ${
                      dday <= 7 ? 'bg-main text-white' : 'bg-gray500 text-main2'
                    }`}>
                    D-{dday}
                  </div>
                )}

                {/* 좋아요 수 */}
                <div className="absolute bottom-3 left-3 z-10 flex items-center space-x-1">
                  <Image src="/icons/PinkHeart.svg" alt="pink-heart" width={15} height={13} />
                  <span className="text-[0.75rem] font-medium text-gray300">
                    {String(heartbeatNums[club.id] || 0).padStart(3, '0')}
                  </span>
                </div>
              </div>

              <div className="relative pb-5 pt-3 text-white">
                <h3 className="truncate text-[0.875rem] font-bold">{club.koreanName}</h3>
                <p className="text-[0.625rem] text-gray100">
                  {club.startDate && club.endDate ? formatDateRange(club.startDate, club.endDate) : ''}
                </p>
                <div className="mt-[0.12rem] inline-block rounded-[0.5rem] bg-gray700 px-[0.5rem] py-[0.13rem] text-[0.75rem] text-gray300">
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
