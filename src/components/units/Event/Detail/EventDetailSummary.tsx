'use client';

import Image from 'next/image';
import { EventDetail } from '@/lib/types';
import { differenceInCalendarDays } from 'date-fns';

export default function EventDetailSummary({ eventDetail }: { eventDetail: EventDetail }) {
  const today = new Date();
  const start = new Date(eventDetail.startDate);
  const dDay = differenceInCalendarDays(start, today);

  return (
    <div className="relative w-full">
      {/* 이미지 */}
      <div className="relative h-[16.75rem] w-full">
        <Image
          src={eventDetail.images?.[0] || '/images/defaultImage.png'}
          alt="event"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />

        {/* 텍스트 오버레이 (제목 + D-Day + 날짜 + 지역 전부 이미지 안에 위치) */}
        <div className="absolute bottom-0 left-0 z-10 w-full bg-gradient-to-t from-black/80 to-transparent px-4 py-4">
          {/* 제목 + 디데이 */}
          <div className="flex items-center gap-2">
            <h2 className="text-[1.5rem] font-bold text-white">{eventDetail.title}</h2>
            <div className="rounded-[0.13rem] bg-gray500 px-[0.68rem] py-[0.25rem] text-[0.75rem] text-gray100">
              {dDay > 0 ? `D-${dDay}` : dDay === 0 ? 'D-DAY' : `D-${Math.abs(dDay)}`}
            </div>
          </div>

          {/* 날짜 및 지역 */}
          <p className="mt-4 text-[0.875rem] text-gray300">
            {eventDetail.startDate} ~ {eventDetail.endDate}
          </p>
          <div className="mt-[0.13rem] flex items-center gap-[0.38rem]">
            <Image src="/icons/map-03.svg" alt="map" width={16} height={16} />
            <p className="text-[0.875rem] text-gray300">{eventDetail.location}</p>
            <Image src="/icons/chevron-right.svg" alt="arrow" width={12} height={12} />
          </div>
        </div>
      </div>
    </div>
  );
}
