'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { postLikeEvent } from '@/lib/actions/event-controller/postLikeEvent';
import { deleteLikeEvent } from '@/lib/actions/event-controller/deleteLikeEvent';
import { EventType } from './EventContainer';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';

function getDdayLabel(startDate: string, endDate: string) {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  // 날짜만 비교하기 위해 시간을 00:00:00으로 설정
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startDateOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDateOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  // 이벤트가 이미 종료된 경우
  if (todayDate > endDateOnly) {
    return null;
  }

  // 이벤트가 진행 중인 경우 (오늘이 시작일과 종료일 사이)
  if (todayDate >= startDateOnly && todayDate <= endDateOnly) {
    return 0; // D-0 (진행중)
  }

  // 이벤트 시작까지 남은 일수 계산
  const diff = Math.ceil((startDateOnly.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : null;
}

// 날짜 형식을 YYYY-MM-DD 형식으로 변환하는 함수
export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

// 날짜 범위를 YYYY-MM-DD ~ YYYY-MM-DD 형식으로 변환하는 함수
export function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // 같은 날짜인지 확인 (시간 제외)
  const isSameDay = start.toDateString() === end.toDateString();

  if (isSameDay) {
    // 같은 날짜면 시작 날짜만 표시
    return formatDate(startDate);
  } else {
    // 다른 날짜면 범위로 표시
    const formattedStart = formatDate(startDate);
    const formattedEnd = formatDate(endDate);
    return `${formattedStart} ~ ${formattedEnd}`;
  }
}

// region의 언더스코어를 띄어쓰기로 변환하는 함수
export function formatRegion(region: string) {
  return region.replace(/_/g, ' ');
}

// 지역명을 화면 표시용으로 변환하는 함수
function convertRegionForDisplay(region: string): string {
  const conversionMap: { [key: string]: string } = {
    '압구정 로데오': '압구정로데오',
    '강남 신사': '강남 · 신사',
  };

  return conversionMap[region] || region;
}

export default function EventLists({
  tab,
  events,
  setEvents,
  onLoadMore,
  hasMore = false,
  loading = false,
}: {
  tab: 'upcoming' | 'past';
  events: EventType[];
  setEvents: React.Dispatch<React.SetStateAction<EventType[]>>;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}) {
  const accessToken = useRecoilValue(accessTokenState) || '';
  const [likeLock, setLikeLock] = useState(false);

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

  const handleLike = async (e: React.MouseEvent, eventId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (likeLock) return;
    setLikeLock(true);

    try {
      const index = events.findIndex((e) => e.eventId === eventId);
      if (index === -1) return;

      const target = events[index];
      const liked = target.liked ?? false;

      if (liked) {
        await deleteLikeEvent(eventId, accessToken);
      } else {
        await postLikeEvent(eventId, accessToken);
      }

      const updated = [...events];
      updated[index] = {
        ...target,
        liked: !liked,
        likes: liked ? Math.max(0, target.likes - 1) : target.likes + 1,
      };

      setEvents(updated);
    } catch (err) {
      console.error('좋아요 처리 에러', err);
    } finally {
      setLikeLock(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-1">
      {events.map((event) => {
        const dday = tab === 'upcoming' ? getDdayLabel(event.startDate, event.endDate) : null;

        return (
          <Link key={event.eventId} href={`/event/${event.eventId}`}>
            <div className="overflow-hidden rounded-[0.5rem]">
              <div className="relative aspect-square w-full">
                <Image
                  src={event.thumbImage || '/images/DefaultImage.png'}
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
                  className="rounded-[0.75rem] object-cover"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/80 to-transparent" />

                <div
                  onClick={(e) => handleLike(e, event.eventId)}
                  className="absolute bottom-[0.62rem] right-[0.62rem] z-10 cursor-pointer">
                  <Image
                    src={event.liked ? '/icons/FilledHeart.svg' : '/icons/GrayHeart.svg'}
                    alt="heart"
                    width={27.43}
                    height={24}
                  />
                </div>

                {typeof dday === 'number' && (
                  <div
                    className={`absolute left-[0.62rem] top-[0.62rem] z-10 rounded-[0.5rem] px-[0.38rem] pb-[0.19rem] pt-[0.12rem] text-body3-12-medium ${dday <= 7 ? 'bg-main text-white' : 'bg-gray500 text-main2'}`}>
                    D-{dday}
                  </div>
                )}

                <div className="absolute bottom-3 left-3 z-10 flex items-center space-x-1">
                  <Image src="/icons/PinkHeart.svg" alt="pink-heart" width={15} height={13} />
                  <span className="text-body3-12-medium text-gray300">{String(event.likes || 0).padStart(3, '0')}</span>
                </div>
              </div>

              <div className="relative pb-5 pt-3 text-white">
                <h3 className="text-body-14-bold truncate">{event.title}</h3>
                <p className="text-body-10-medium text-gray100">{formatDateRange(event.startDate, event.endDate)}</p>
                <div className="text-body-11-medium mt-[0.38rem] inline-block rounded-[0.5rem] bg-gray700 px-[0.5rem] pb-[0.25rem] pt-[0.19rem] text-gray300">
                  {convertRegionForDisplay(formatRegion(event.region))}
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
}
