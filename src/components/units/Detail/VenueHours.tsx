'use client';
import { useEffect, useState } from 'react';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
interface VenueHoursProps {
  hours: { [key: string]: string };
}

const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];

const fullDaysOfWeek: { [key: string]: string } = {
  일: '일요일',
  월: '월요일',
  화: '화요일',
  수: '수요일',
  목: '목요일',
  금: '금요일',
  토: '토요일',
};

const parseHours = (hours: string) => {
  return hours.replace('~', ' - ');
};

const VenueHours = ({ hours }: VenueHoursProps) => {
  const [currentDayMessage, setCurrentDayMessage] = useState('');

  useEffect(() => {
    //이러케하면 나혼나나 ㅋ
    const getDayMessage = () => {
      const dayMessages = [
        '아쉬운 일요일',
        '우울한 월요일',
        '아직 화요일이지만',
        '심심한 수요일',
        '반가운 목요일',
        '신나는 금요일',
        '재밌는 토요일',
      ];
      const today = new Date();
      return dayMessages[today.getDay()];
    };

    setCurrentDayMessage(getDayMessage());
  }, []);

  return (
    <div className="bg-BG-black">
      <div className="px-[1rem] py-[1.25rem]">
        <h2 className="text-body1-16-bold">운영 시간</h2>
        <div className="mt-[0.75rem] flex flex-col space-y-[0.25rem]">
          {daysOfWeek.map((day) => (
            <div key={day} className="flex items-center space-x-[0.75rem]">
              <p className="text-body2-15-medium text-gray200">
                {fullDaysOfWeek[day]} &nbsp;
                {hours[fullDaysOfWeek[day]] ? parseHours(hours[fullDaysOfWeek[day]]) : '휴무'}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative mt-[1rem] h-[5.625rem] w-full">
        <Image src="/images/AdBanner.png" alt="광고 배너" layout="fill" objectFit="cover" />
        <Link href="https://www.instagram.com/beatbuddy.kr/">
          <div className="absolute inset-0 z-10 flex cursor-pointer flex-col items-start justify-center p-[1.25rem] text-white">
            <span className="text-body3-12-medium">{currentDayMessage}</span>
            <span className="text-body2-15-bold">더 많은 정보를 얻고 싶다면?</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default VenueHours;
