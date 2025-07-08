'use client';

import Image from 'next/image';
import { postLikeEvent } from '@/lib/actions/event-controller/postLikeEvent';
import { deleteLikeEvent } from '@/lib/actions/event-controller/deleteLikeEvent';
import { useEffect, useState } from 'react';

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
        setLikes(prev => Math.max(0, prev - 1));
      } else {
        await postLikeEvent(event.eventId, accessToken);
        setLiked(true);
        setLikes(prev => prev + 1);
      }
    } catch (err) {
      console.error('좋아요 실패', err);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div ref={lastRef as any} className="w-full">
      <div className="relative w-full aspect-square overflow-hidden rounded-[1.25rem]">
        <Image
          src={event.thumbImage || '/images/DefaultImage.png'}
          alt={event.title}
          fill
          className="object-cover"
        />

        <div className="absolute right-[1.5rem] top-[1.5rem] z-10">
          <Image
            src={liked ? '/icons/FilledHeart.svg' : '/icons/GrayHeart.svg'}
            alt="좋아요"
            width={24}
            height={24}
            onClick={handleLike}
            className="cursor-pointer"
          />
        </div>

        <div className="absolute left-[1.5rem] bottom-[1.5rem] z-10 flex items-center space-x-[0.25rem]">
          <Image src="/icons/PinkHeart.svg" alt="하트" width={16} height={16} />
          <span className="text-[0.75rem] text-gray100">
            {String(likes).padStart(3, '0')}
          </span>
        </div>
      </div>

      <div className="pt-4 text-white">
        <p className="text-[0.75rem] text-gray100">{event.startDate}</p>
        <h3 className="text-subtitle-20-bold mt-1">{event.title}</h3>
        <p className="text-[0.75rem] text-gray300 truncate mt-1">{event.content}</p>
        <p className="text-[0.875rem] text-gray100 mt-2">{event.location}</p>
      </div>
    </div>
  );
}
