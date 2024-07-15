'use client';

import React from 'react';
import Image from 'next/image';
import { VenueHoursProps } from '@/lib/types';

const daysOfWeek = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

const VenueHours = ({ hours }: VenueHoursProps) => {
  return (
    <>
      <div className="px-[1rem] py-[1.25rem]">
        <h2 className="text-body1-16-bold">운영 시간</h2>
        <div className="mt-[0.75rem] flex flex-col space-y-[0.25rem]">
          {daysOfWeek.map((day) => (
            <div key={day} className="flex items-center space-x-[0.75rem]">
              <p className="text-body2-15-medium text-gray200">
                {day}: {hours[day]}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative mb-[2.5rem] mt-[1rem] h-[5.625rem] w-full">
        <Image src="/images/AdBanner.png" alt="광고 배너" layout="fill" objectFit="cover" />
        <div className="absolute inset-0 z-10 flex flex-col items-start justify-center p-[1.25rem] text-white">
          <span className="text-body3-12-medium">신나는 금요일</span>
          <span className="text-body2-15-bold">분위기 좋은 클럽 찾는다면?</span>
        </div>
      </div>
    </>
  );
};

export default VenueHours;
