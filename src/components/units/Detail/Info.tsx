'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ClubProps } from '@/lib/types';

const Info = ({ venue, isHeartbeat }: ClubProps) => {
  const [showMessage, setShowMessage] = useState(false);

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 2000); // 2초 후에 메세지 숨기기
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleInstagramClick = () => {
    if (venue.instaUrl) {
      window.open(venue.instaUrl, '_blank'); // 새 창에서 열기
    }
  };

  return (
    <div className="bg-BG-black px-[1rem] py-[2rem]">
      <div className="flex justify-around">
        <div>
          <div className="flex flex-col items-center min-w-[6rem] px-[2rem]">
            <Image src="/icons/phone.fill.svg" alt="phone icon" width={24} height={24} />
            <p className="mt-[0.5rem] text-body2-15-medium text-gray200">전화</p>
          </div>
        </div>
        <div className="flex cursor-pointer flex-col items-center min-w-[8rem] px-[2rem] border border-b-none border-t-none" onClick={handleInstagramClick}>
          <Image src="/icons/insta.fill.svg" alt="instagram icon" width={24} height={24} />
          <p className="mt-[0.5rem] text-body2-15-medium text-gray200">SNS</p>
        </div>
        <div className="flex flex-col items-center min-w-[6rem] ">
          <Image
            src={venue.smokingAllowed ? '/icons/smoke.fill.svg' : '/icons/icon-nonsmoking.svg'}
            alt="smoking icon"
            width={24}
            height={24}
          />
          <p className="mt-[0.5rem] text-body2-15-medium text-gray200">
            {venue.smokingAllowed ? '흡연 가능' : '흡연 불가'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Info;
