'use client';

import Image from 'next/image';
import { postLikeEvent } from '@/lib/actions/event-controller/postLikeEvent';
import { deleteLikeEvent } from '@/lib/actions/event-controller/deleteLikeEvent';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate, formatDateRange, formatRegion } from './EventLists';

// 지역명을 화면 표시용으로 변환하는 함수
function convertRegionForDisplay(region: string): string {
  const conversionMap: { [key: string]: string } = {
    '압구정 로데오': '압구정로데오',
    '강남 신사': '강남 · 신사',
  };

  return conversionMap[region] || region;
}

interface EventType {
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

export default function EventCard({
  event,
  lastRef,
  accessToken,
}: {
  event: EventType;
  lastRef?: React.RefObject<HTMLDivElement> | null;
  accessToken: string;
}) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const router = useRouter();
  // ✅ 서버에서 받은 초기값 반영 (1회만 실행)
  useEffect(() => {
    setLiked(event.liked ?? false);
    setLikes(event.likes ?? 0);
    console.log(event.liked);
    console.log(event.likes);
  }, [event.eventId, event.liked, event.likes]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isLiking) return;
    setIsLiking(true);

    try {
      if (liked) {
        await deleteLikeEvent(event.eventId, accessToken);
        setLiked(false);
        setLikes((prev) => Math.max(0, prev - 1));
      } else {
        await postLikeEvent(event.eventId, accessToken);
        setLiked(true);
        setLikes((prev) => prev + 1);
      }
    } catch (err) {
      console.error('좋아요 실패', err);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div ref={lastRef as any} className="w-full cursor-pointer" onClick={() => router.push(`/event/${event.eventId}`)}>
      <div className="relative aspect-square w-full overflow-hidden rounded-[1.25rem]">
        <Image src={event.thumbImage || '/images/DefaultImage.png'} alt={event.title} fill className="object-cover" />

        <div className="absolute right-[1.5rem] top-[1.5rem] z-10">
          <Image
            src={liked ? '/icons/FilledHeart.svg' : '/icons/whiteHeart.svg'}
            alt="좋아요"
            width={27}
            height={24}
            onClick={handleLike}
            className="cursor-pointer"
          />
        </div>

        <div className="absolute bottom-[1.5rem] left-[1.5rem] z-10 flex items-center space-x-[0.25rem]">
          <Image src="/icons/PinkHeart.svg" alt="하트" width={16} height={16} />
          <span className="text-body3-12-medium text-gray100">{String(likes).padStart(3, '0')}</span>
        </div>
      </div>

      <div className="pt-4 text-white">
        <p className="text-body3-12-medium text-gray100">{formatDateRange(event.startDate, event.endDate)}</p>
        <h3 className="mt-[0.12rem] text-subtitle-20-bold">{event.title}</h3>
        <p className="mt-[0.12rem] truncate text-body3-12-medium text-gray300">{event.content}</p>
        <span className="mt-[0.38rem] inline-block rounded-[0.5rem] bg-gray700 px-2 py-1 text-body-13-medium text-gray300">
          {convertRegionForDisplay(formatRegion(event.region))}
        </span>
      </div>
    </div>
  );
}
