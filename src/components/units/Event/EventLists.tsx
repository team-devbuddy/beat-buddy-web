'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { postLikeEvent } from '@/lib/actions/event-controller/postLikeEvent';
import { deleteLikeEvent } from '@/lib/actions/event-controller/deleteLikeEvent';
import { EventType } from './EventContainer';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';

function getDdayLabel(endDate: string) {
  const today = new Date();
  const end = new Date(endDate);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : null;
}

export default function EventLists({
  tab,
  events,
  setEvents,
}: {
  tab: 'upcoming' | 'past';
  events: EventType[];
  setEvents: React.Dispatch<React.SetStateAction<EventType[]>>;
}) {
  const accessToken = useRecoilValue(accessTokenState) || '';
  const [likeLock, setLikeLock] = useState(false);

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
    <div className="grid grid-cols-2 gap-4">
      {events.map((event) => {
        const dday = tab === 'upcoming' ? getDdayLabel(event.endDate) : null;

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
                  className="absolute bottom-3 right-3 z-10 cursor-pointer">
                  <Image
                    src={event.liked ? '/icons/FilledHeart.svg' : '/icons/GrayHeart.svg'}
                    alt="heart"
                    width={27}
                    height={24}
                  />
                </div>

                {typeof dday === 'number' && (
                  <div
                    className={`absolute left-3 top-3 z-10 rounded-[0.25rem] px-[0.38rem] py-[0.13rem] text-[0.75rem] ${dday <= 7 ? 'bg-main text-white' : 'bg-gray500 text-main2'}`}>
                    D-{dday}
                  </div>
                )}

                <div className="absolute bottom-3 left-3 z-10 flex items-center space-x-1">
                  <Image src="/icons/PinkHeart.svg" alt="pink-heart" width={15} height={13} />
                  <span className="text-[0.75rem] font-medium text-gray300">
                    {String(event.likes || 0).padStart(3, '0')}
                  </span>
                </div>
              </div>

              <div className="relative pb-5 pt-4 text-white">
                <h3 className="truncate text-[0.875rem] font-bold">{event.title}</h3>
                <p className="mt-1 text-[0.625rem] text-gray100">
                  {event.startDate} ~ {event.endDate}
                </p>
                <p className="mt-1 truncate text-[0.75rem] text-gray300">{event.location}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
