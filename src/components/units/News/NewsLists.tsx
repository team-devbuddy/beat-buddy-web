'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { heartAnimation } from '@/lib/animation';

interface Event {
  id: string;
  title: string;
  thumbImage: string;
  location: string;
  startDate: string;
  endDate: string;
}

interface EventListsProps {
  events: Event[];
  tab: 'upcoming' | 'past';
  likedEvents: { [key: string]: boolean };
  likeNums: { [key: string]: number };
  onLikeClick: (e: React.MouseEvent, id: string) => void;
  sortBy?: '최신순' | '인기순';
}

export default function EventLists({
  events,
  tab,
  likedEvents,
  likeNums,
  onLikeClick,
  sortBy = '최신순',
}: EventListsProps) {
  const [clickedHeart, setClickedHeart] = useState<{ [key: string]: boolean }>({});
  const now = new Date();

  // 필터링
  const filtered = useMemo(() => {
    return events.filter((e) => {
      const date = new Date(e.endDate);
      return tab === 'upcoming' ? date >= now : date < now;
    });
  }, [events, tab]);

  // 정렬
  const sorted = useMemo(() => {
    if (sortBy === '인기순') {
      return [...filtered].sort((a, b) => (likeNums[b.id] || 0) - (likeNums[a.id] || 0));
    }
    return [...filtered].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }, [filtered, sortBy, likeNums]);

  // 하트 클릭 처리
  const handleHeartClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setClickedHeart((prev) => ({ ...prev, [id]: true }));
    onLikeClick(e, id);
    setTimeout(() => setClickedHeart((prev) => ({ ...prev, [id]: false })), 500);
  };

  return (
    <div className="flex w-full flex-col bg-BG-black">
      <div className="grid grid-cols-2 gap-x-[0.5rem] gap-y-[1.5rem] px-[0.5rem] pt-4">
        {sorted.map((event) => (
          <Link key={event.id} href={`/event/${event.id}`}>
            <motion.div
              whileHover={{
                y: -5,
                boxShadow: '0px 5px 15px rgba(151, 154, 159, 0.05)',
              }}
              className="relative flex flex-col overflow-hidden rounded-md">
              {/* 이미지 */}
              <div className="relative w-full pb-[100%]">
                <Image
                  src={event.thumbImage || '/images/DefaultImage.png'}
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
                  className="rounded-md object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                {/* 좋아요 */}
                <motion.div
                  className="absolute right-3 top-3 z-10 cursor-pointer"
                  onClick={(e) => handleHeartClick(e, event.id)}
                  variants={heartAnimation}
                  initial="initial"
                  animate={clickedHeart[event.id] ? 'clicked' : 'initial'}>
                  <Image
                    src={likedEvents[event.id] ? '/icons/FilledHeart.svg' : '/icons/PinkHeart.svg'}
                    alt="heart"
                    width={28}
                    height={28}
                  />
                </motion.div>

                {/* 좋아요 수 */}
                <div className="absolute bottom-3 left-3 z-10 flex items-center space-x-1">
                  <Image src="/icons/PinkHeart.svg" alt="heart" width={16} height={16} />
                  <span className="text-[0.75rem] text-gray100">
                    {String(likeNums[event.id] || 0).padStart(3, '0')}
                  </span>
                </div>
              </div>

              {/* 텍스트 */}
              <div className="p-3 text-white">
                <p className="text-[0.75rem] text-gray100">
                  {event.startDate} ~ {event.endDate}
                </p>
                <h3 className="mt-1 truncate text-[0.875rem] font-bold">{event.title}</h3>
                <p className="mt-1 truncate text-[0.75rem] text-gray300">{event.location}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
