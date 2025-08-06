'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { getVenueEvents } from '@/lib/actions/venue-controller/getVenueEvents';
import { postLikeEvent } from '@/lib/actions/event-controller/postLikeEvent';
import { deleteLikeEvent } from '@/lib/actions/event-controller/deleteLikeEvent';
import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenState, likedEventsState, likeCountState } from '@/context/recoil-context';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { heartAnimation } from '@/lib/animation';

interface NewsItem {
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
  region: string;
  isFreeEntrance: boolean;
  isAttending: boolean;
  isAuthor: boolean;
}

interface NewsContentsProps {
  newsList: NewsItem[];
  venueId: string;
  sortType: 'latest' | 'popular';
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

// 이미지 로딩을 위한 컴포넌트
const SafeImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [imageSrc, setImageSrc] = useState(src || '/images/DefaultImage.png');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImageSrc(src || '/images/DefaultImage.png');
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    console.log('Image load error, falling back to default image');
    setImageSrc('/images/DefaultImage.png');
    setHasError(true);
    setIsLoading(false);
  };

  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="bg-gray800 absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray600 border-t-main"></div>
        </div>
      )}
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={`object-cover object-top ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ${className || ''}`}
        sizes="(max-width: 768px) 50vw, 25vw"
        onLoad={handleLoad}
        onError={handleError}
        priority={false}
        unoptimized={hasError} // 에러 발생 시 최적화 비활성화
      />
    </div>
  );
};

const calculateDday = (startDate: string, endDate: string) => {
  const today = dayjs();
  const endDateObj = dayjs(endDate);

  if (!endDateObj.isValid()) {
    return 'END';
  }

  const diff = endDateObj.diff(today, 'day');

  if (diff < 0) {
    return 'END';
  } else if (diff === 0) {
    return 'D-DAY';
  } else {
    return `D-${diff}`;
  }
};

const formatDateRange = (startDate: string, endDate: string) => {
  const start = dayjs(startDate).format('YYYY-MM-DD');
  const end = dayjs(endDate).format('YYYY-MM-DD');
  return `${start} ~ ${end}`;
};

const sortNewsByDday = (newsList: NewsItem[]) => {
  return [...newsList].sort((a, b) => {
    const getDdayValue = (dDay: string) => {
      if (dDay === 'END') {
        return Number.MAX_SAFE_INTEGER; // END는 항상 마지막
      }
      if (dDay === 'TODAY') {
        return 0; // TODAY는 최우선
      }
      if (dDay.startsWith('D-')) {
        return parseInt(dDay.split('-')[1], 10); // D-숫자에서 숫자만 추출
      }
      return 0; // 기타 값은 최소값으로 설정
    };

    const aDday = calculateDday(a.startDate, a.endDate);
    const bDday = calculateDday(b.startDate, b.endDate);

    return getDdayValue(aDday) - getDdayValue(bDday);
  });
};

const EmptyNews = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <img src="/icons/grayLogo.svg" alt="BeatBuddy Logo" className="mb-6 h-16 w-16" />
      <p className="text-body2-15-medium text-gray300">아직 등록된 이벤트가 없습니다.</p>
    </div>
  );
};

const NewsContents = ({ newsList, venueId, sortType }: NewsContentsProps) => {
  const [events, setEvents] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [clickedHeart, setClickedHeart] = useState<{ [key: number]: boolean }>({});
  const accessToken = useRecoilValue(accessTokenState);
  const [likedEvents, setLikedEvents] = useRecoilState(likedEventsState);
  const [likeCounts, setLikeCounts] = useRecoilState(likeCountState);

  // 무한 스크롤을 위한 Intersection Observer
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // 무한 스크롤 콜백
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !loading && events.length > visibleCount) {
        setVisibleCount((prev) => prev + 6);
      }
    },
    [loading, events.length],
  );

  // 좋아요 핸들러
  const handleHeartClick = async (e: React.MouseEvent, eventId: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!accessToken) return;

    setClickedHeart((prev) => ({ ...prev, [eventId]: true }));

    try {
      const currentLiked = likedEvents[eventId] || false;
      const currentCount = likeCounts[eventId] || 0;

      if (currentLiked) {
        // 좋아요 취소
        await deleteLikeEvent(eventId, accessToken);
        setLikedEvents((prev) => ({ ...prev, [eventId]: false }));
        setLikeCounts((prev) => ({ ...prev, [eventId]: currentCount - 1 }));
      } else {
        // 좋아요 추가
        await postLikeEvent(eventId, accessToken);
        setLikedEvents((prev) => ({ ...prev, [eventId]: true }));
        setLikeCounts((prev) => ({ ...prev, [eventId]: currentCount + 1 }));
      }
    } catch (error) {
      console.error('좋아요 처리 중 오류가 발생했습니다:', error);
    } finally {
      setTimeout(() => setClickedHeart((prev) => ({ ...prev, [eventId]: false })), 500);
    }
  };

  // API에서 이벤트 데이터 가져오기
  useEffect(() => {
    const fetchEvents = async () => {
      if (!accessToken) {
        setError('Access token is not available');
        setLoading(false);
        return;
      }

      if (!venueId || venueId === 'undefined') {
        setError('Invalid venue ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching events for venue:', venueId, 'sortType:', sortType);
        const data = await getVenueEvents(venueId, sortType, accessToken);
        console.log('Received events data:', data);
        setEvents(Array.isArray(data) ? data : []);

        // 좋아요 상태 초기화
        if (Array.isArray(data)) {
          const initialLikedState: { [key: number]: boolean } = {};
          const initialLikeCount: { [key: number]: number } = {};

          data.forEach((event) => {
            initialLikedState[event.eventId] = event.liked;
            initialLikeCount[event.eventId] = event.likes;
          });

          setLikedEvents((prev) => ({ ...prev, ...initialLikedState }));
          setLikeCounts((prev) => ({ ...prev, ...initialLikeCount }));
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        const errorMessage = err instanceof Error ? err.message : '이벤트를 불러오는데 실패했습니다.';
        setError(errorMessage);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [venueId, sortType, accessToken]);

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
  }, [handleIntersection, events.length]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 h-16 w-16 animate-spin rounded-full border-4 border-gray300 border-t-main"></div>
        <p className="text-body2-15-medium text-gray300">이벤트를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Image src="/icons/grayLogo.svg" alt="BeatBuddy Logo" className="mb-6 h-16 w-16" />
        <p className="text-body2-15-medium text-gray300">{error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return <EmptyNews />;
  }

  const sortedEvents = sortNewsByDday(events);
  const visibleEvents = sortedEvents.slice(0, visibleCount);

  const getDdayStyle = (dDay: string) => {
    if (dDay === 'END') {
      return 'bg-gray500 text-gray200';
    }
    if (dDay === 'TODAY') {
      return 'bg-main text-white';
    }
    if (dDay.startsWith('D-')) {
      const dayNumber = parseInt(dDay.split('-')[1], 10);
      return dayNumber <= 7 ? 'bg-main text-white' : 'bg-gray500 text-gray200';
    }
    return 'bg-gray500 text-gray200';
  };

  return (
    <div className="px-5 pt-[0.88rem]">
      {/* 뉴스 목록 */}
      <div className="grid grid-cols-2 gap-4">
        {visibleEvents.map((news) => (
          <Link key={news.eventId} href={`/event/${news.eventId}`} passHref>
            <div className="flex cursor-pointer flex-col overflow-hidden rounded-[0.5rem]">
              {/* 이미지 */}
              <div className="relative h-[160px] w-full overflow-hidden rounded-[0.5rem]">
                <SafeImage
                  src={news.thumbImage || '/images/DefaultImage.png'}
                  alt={news.title}
                  className="object-cover object-top"
                />
                {/* 지난 이벤트 오버레이 */}
                {calculateDday(news.startDate, news.endDate) === 'END' && (
                  <div
                    className="absolute inset-0 bg-black/30"
                    style={{
                      background:
                        'linear-gradient(0deg, rgba(0, 0, 0, 0.30) 0%, rgba(0, 0, 0, 0.30) 100%), linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.56) 59.6%)',
                    }}
                  />
                )}
                {/* 디데이 - 이미지 위에 좌측 상단 */}
                <div className="absolute left-[0.62rem] top-[0.62rem]">
                  <span
                    className={`rounded-[0.5rem] ${
                      calculateDday(news.startDate, news.endDate) === 'END'
                        ? 'bg-gray500/70 text-gray300'
                        : 'bg-main text-white'
                    } px-[0.38rem] py-[0.25rem] text-center text-[0.75rem] leading-[160%] ${getDdayStyle(
                      calculateDday(news.startDate, news.endDate),
                    )}`}
                    style={{
                      whiteSpace: 'nowrap',
                    }}>
                    {calculateDday(news.startDate, news.endDate)}
                  </span>
                </div>

                {/* 좋아요 개수 - 이미지 위에 좌측 하단 */}
                <div className="absolute bottom-[0.62rem] left-[0.62rem] flex items-center space-x-[0.25rem]">
                  <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={15} height={13} />
                  <span className="text-[0.75rem] text-gray300">
                    {likeCounts[news.eventId] !== undefined ? likeCounts[news.eventId] : news.likes}
                  </span>
                </div>

                {/* 좋아요 버튼 - 이미지 위에 우측 하단 */}
                <motion.div
                  className={`absolute ${likedEvents[news.eventId] ? 'bottom-[0.62rem] right-[0.62rem]' : 'bottom-[0.75rem] right-[0.75rem]'} cursor-pointer`}
                  onClick={(e) => handleHeartClick(e, news.eventId)}
                  variants={heartAnimation}
                  initial="initial"
                  animate={clickedHeart[news.eventId] ? 'clicked' : 'initial'}>
                  <Image
                    src={likedEvents[news.eventId] ? '/icons/FilledHeart.svg' : '/icons/grayHeart.svg'}
                    alt="heart icon"
                    width={likedEvents[news.eventId] ? 27 : 24}
                    height={likedEvents[news.eventId] ? 24 : 24}
                  />
                </motion.div>
              </div>

              {/* 뉴스 정보 */}
              <div className="flex flex-col pt-3">
                <div className="flex items-center">
                  <h3 className="max-w-[100%] truncate text-[0.875rem] font-bold leading-[160%] text-white">
                    {truncateText(news.title, 12)}
                  </h3>
                </div>
                <span
                  className="text-[0.625rem] text-gray100"
                  style={{
                    whiteSpace: 'nowrap',
                  }}>
                  {formatDateRange(news.startDate, news.endDate)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 무한 스크롤 로딩 인디케이터 */}
      {visibleCount < sortedEvents.length && (
        <div ref={loadingRef} className="flex justify-center py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray300 border-t-main"></div>
        </div>
      )}
    </div>
  );
};

export default NewsContents;
