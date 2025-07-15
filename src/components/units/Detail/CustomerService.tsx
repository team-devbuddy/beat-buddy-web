'use client';
import { useEffect } from 'react';
import { useState } from 'react';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CustomerService = () => {
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
    <div className="pt-7">
      <div className="relative  h-[5.625rem] w-full">
        <Image src="/images/AdBanner.png" alt="광고 배너" layout="fill" objectFit="cover" />
        <Link href="https://www.instagram.com/beatbuddy.kr/">
          <div className="absolute inset-0 z-2 flex cursor-pointer flex-col items-start justify-center p-[1.25rem] text-white">
            <span className="text-body3-12-medium">{currentDayMessage}</span>
            <span className="text-body2-15-bold">더 많은 정보를 얻고 싶다면?</span>
          </div>
        </Link>
      </div>
      <Link
        href="https://forms.gle/rcSfxUegbNykLnZD7"
        className="flex cursor-pointer items-center justify-between border-t border-gray500 bg-BG-black px-[1rem] pb-[3.75rem] pt-[2.5rem] text-white">
        <div>
          <span className="block text-body2-15-bold">잘못된 정보가 있나요?</span>
          <span className="mt-1 block pb-6 text-body3-12-medium text-gray300">
            수정이 필요하거나 폐업한 업장이라면 알려주세요!
          </span>
        </div>
        <Image src="/icons/ArrowHeadRight.svg" alt="Arrow Head right icon" width={24} height={24} />
      </Link>
    </div>
  );
};

export default CustomerService;
