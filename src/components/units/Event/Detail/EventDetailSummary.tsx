'use client';

import Image from 'next/image';
import { EventDetail } from '@/lib/types';
import { differenceInCalendarDays } from 'date-fns';
import { useState } from 'react';

export default function EventDetailSummary({ eventDetail }: { eventDetail: EventDetail }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const today = new Date();
  const start = new Date(eventDetail.startDate);
  const dDay = differenceInCalendarDays(start, today);

  const handleImageClick = () => {
    if (eventDetail.images && eventDetail.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % eventDetail.images.length);
    }
  };

  return (
    <div className="relative w-full">
      {/* 이미지 */}
      <div className="relative h-[21.875rem] w-full">
        <Image
          src={eventDetail.images?.[currentImageIndex] || '/images/defaultImage.png'}
          alt="event"
          fill
          sizes="100vw"
          className="object-cover"
          priority
          onClick={handleImageClick}
        />

        {/* 텍스트 오버레이 (제목 + D-Day + 날짜 + 지역 전부 이미지 안에 위치) */}
        <div className="absolute bottom-0 left-0 z-10 w-full bg-gradient-to-t from-black/80 to-transparent px-5 py-5">
          {/* 제목 + 디데이 */}
          <div className="flex items-center gap-2">
            <h2 className="text-[1.5rem] font-bold text-white">{eventDetail.title}</h2>
            <div
              className={`rounded-[0.5rem] px-2 py-1 text-[0.8125rem] ${
                dDay <= 7 && dDay >= 0 ? 'bg-main text-white' : 'bg-gray500 text-gray100'
              }`}>
              {dDay > 0 ? `D-${dDay}` : dDay === 0 ? 'D-DAY' : `D-${Math.abs(dDay)}`}
            </div>
          </div>

          {/* 날짜 및 지역 
          <p className="mt-4 text-[0.875rem] text-gray300">
            {eventDetail.startDate} ~ {eventDetail.endDate}
          </p>
          <div className="mt-[0.13rem] flex items-center gap-[0.38rem]">
            <Image src="/icons/map-03.svg" alt="map" width={16} height={16} />
            <p className="text-[0.875rem] text-gray300">{eventDetail.location}</p>
            <Image src="/icons/chevron-right.svg" alt="arrow" width={12} height={12} />
          </div>
          */}
        </div>

        {/* 이미지 인덱스 표시 (우측 하단) */}
        {eventDetail.images && eventDetail.images.length > 0 && (
          <div className="absolute bottom-5 right-5 z-20 rounded bg-black/70 px-2 py-1 text-[0.6875rem] text-gray200">
            {currentImageIndex + 1}/{eventDetail.images.length}
          </div>
        )}
      </div>
    </div>
  );
}
